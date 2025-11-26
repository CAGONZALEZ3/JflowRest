import { Return } from "../models/return.model.js";
import { Order } from "../models/order.model.js";

const returnController = {
  // 📋 Listar todas las devoluciones (vista del admin)
  getAll: async (req, reply) => {
    try {
      const items = await Return.find()
        .populate("user_id", ["name", "lastName", "email"])
        .populate("order_id", ["_id", "status", "amount", "createdAt"])
        .sort({ createdAt: -1 });

      console.log("📦 DEVOLUCIONES ENCONTRADAS:", items.length);
      reply.send({ success: true, items });
    } catch (err) {
      console.error("Error obteniendo devoluciones:", err);
      reply
        .status(500)
        .send({ success: false, error: "Error obteniendo devoluciones" });
    }
  },

  // 🔍 Obtener detalle de una devolución
  getById: async (req, reply) => {
    try {
      const item = await Return.findById(req.params.id)
        .populate("user_id", ["name", "lastName", "email"])
        .populate("order_id", ["_id", "status", "createdAt"]);
      if (!item)
        return reply
          .status(404)
          .send({ success: false, error: "Devolución no encontrada" });
      reply.send({ success: true, item });
    } catch (err) {
      console.error("Error obteniendo devolución:", err);
      reply
        .status(500)
        .send({ success: false, error: "Error obteniendo devolución" });
    }
  },

  // 📨 Crear una solicitud de devolución (desde el usuario)
  create: async (req, reply) => {
    try {
      const sessionUser = req.session?.user;
      const { order_id, reason } = req.body;

      if (!sessionUser)
        return reply
          .status(401)
          .send({ success: false, error: "Usuario no autenticado" });

      // Buscar el pedido del usuario
      const order = await Order.findOne({
        _id: order_id,
        user_id: sessionUser.id,
      });
      if (!order)
        return reply
          .status(404)
          .send({ success: false, error: "Pedido no encontrado" });

      // Evitar duplicados
      if (order.return?.status && order.return.status !== "none") {
        return reply.send({
          success: false,
          error: "Ya existe una solicitud de devolución para este pedido",
        });
      }

      // Guardar devolución en el pedido (para la vista del usuario)
      order.return = {
        requested: true,
        reason,
        status: "requested",
        requestedAt: new Date(),
      };
      await order.save();

      // Crear registro en la colección Return (para el admin)
      await Return.create({
        order_id: order._id,
        user_id: order.user_id,
        reason,
        method: "refund",
        refund_amount: order.amount || 0,
        status: "requested",
        createdAt: new Date(),
      });

      console.log(`✅ Devolución creada para pedido ${order._id}`);
      reply.send({
        success: true,
        message: "Solicitud de devolución registrada correctamente",
      });
    } catch (err) {
      console.error("Error creando devolución:", err);
      reply
        .status(500)
        .send({ success: false, error: "Error creando devolución" });
    }
  },

  // 🔄 Actualizar estado de una devolución (admin)
  updateStatus: async (req, reply) => {
    try {
      const { id } = req.params;
      const { status, notes, refund_amount } = req.body || {};

      const updated = await Return.findByIdAndUpdate(
        id,
        {
          $set: {
            status,
            notes,
            refund_amount,
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).populate("order_id");

      if (!updated)
        return reply
          .status(404)
          .send({ success: false, error: "Devolución no encontrada" });

      // 🔁 Sincronizar estado con el pedido correspondiente
      if (updated.order_id) {
        await Order.findByIdAndUpdate(updated.order_id._id, {
          $set: {
            "return.status": status,
            "return.resolvedAt": new Date(),
          },
        });
      }

      reply.send({
        success: true,
        message: `Devolución actualizada a estado: ${status}`,
        updated,
      });
    } catch (err) {
      console.error("Error actualizando devolución:", err);
      reply
        .status(500)
        .send({ success: false, error: "Error actualizando devolución" });
    }
  },

  // 🗑️ Eliminar devolución (solo admin)
  remove: async (req, reply) => {
    try {
      const { id } = req.params;

      const deleted = await Return.findByIdAndDelete(id);
      if (!deleted)
        return reply
          .status(404)
          .send({ success: false, error: "Devolución no encontrada" });

      // Limpia también el campo en el pedido
      await Order.findByIdAndUpdate(deleted.order_id, {
        $set: { return: { status: "none" } },
      });

      reply.send({ success: true, message: "Devolución eliminada correctamente" });
    } catch (err) {
      console.error("Error eliminando devolución:", err);
      reply
        .status(500)
        .send({ success: false, error: "Error eliminando devolución" });
    }
  },
};

export default returnController;
