import { Order } from "../models/order.model.js";

const ordersController = {
  // 📦 Obtener todas las órdenes
  getAllOrders: async (req, reply) => {
    try {
      const orders = await Order.find()
        .populate("user_id", ["name", "lastName", "email"])
        .sort({ createdAt: -1 });
      reply.send({ success: true, orders });
    } catch (err) {
      reply.status(500).send({ success: false, error: "Error obteniendo pedidos" });
    }
  },

  // 📦 Obtener órdenes del usuario autenticado
  getUserOrders: async (req, reply) => {
    try {
      const user = req.session.user;
      if (!user)
        return reply.status(401).send({ success: false, error: "Usuario no autenticado" });

      const orders = await Order.find({ user_id: user.id })
        .populate("user_id", ["name", "lastName", "email"])
        .sort({ createdAt: -1 });

      reply.send({ success: true, orders });
    } catch (err) {
      reply.status(500).send({ success: false, error: "Error obteniendo pedidos del usuario" });
    }
  },

  // 🔍 Obtener orden por ID
  getOrderById: async (req, reply) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user_id", ["name", "lastName", "email"]);
      if (!order)
        return reply.status(404).send({ success: false, error: "Pedido no encontrado" });
      reply.send({ success: true, order });
    } catch (err) {
      reply.status(500).send({ success: false, error: "Error obteniendo pedido" });
    }
  },

  // 🔄 Actualizar estado de la orden
  updateOrderStatus: async (req, reply) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated)
        return reply.status(404).send({ success: false, error: "Pedido no encontrado" });
      reply.send({ success: true, updated });
    } catch (err) {
      reply.status(500).send({ success: false, error: "Error actualizando estado" });
    }
  },

  // 🗑️ Eliminar orden
  deleteOrder: async (req, reply) => {
    try {
      const { id } = req.params;
      await Order.findByIdAndDelete(id);
      reply.send({ success: true, message: "Pedido eliminado" });
    } catch (err) {
      reply.status(500).send({ success: false, error: "Error eliminando pedido" });
    }
  },

  // 📍 Obtener tracking (para el mapa)
  getOrderTracking: async (req, reply) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).select("tracking");
      if (!order)
        return reply.code(404).send({ success: false, error: "Orden no encontrada" });
      reply.send({ success: true, tracking: order.tracking });
    } catch (err) {
      reply.code(500).send({ success: false, error: "Error obteniendo tracking" });
    }
  },

  // 🚚 Actualizar ubicación (repartidor / sistema)
  updateOrderLocation: async (req, reply) => {
    try {
      const { id } = req.params;
      const { lat, lng, status } = req.body;

      const order = await Order.findById(id);
      if (!order)
        return reply.code(404).send({ success: false, error: "Orden no encontrada" });

      order.tracking.currentLocation = { lat, lng };
      order.tracking.history.push({ lat, lng });
      if (status) order.tracking.status = status;
      await order.save();

      // 🔔 Emitir cambio en tiempo real (si usas socket.io)
      req.io?.emit("tracking_update", { orderId: id, lat, lng, status });

      reply.send({ success: true, tracking: order.tracking });
    } catch (err) {
      reply.code(500).send({ success: false, error: "Error actualizando ubicación" });
    }
  },

  // 📊 Resumen general de pagos (para Admin)
// 📊 Resumen general de pagos (para Admin)
getPaymentsSummary: async (req, reply) => {
  try {
    const allOrders = await Order.find();

    const totalReceived = allOrders
      .filter(o => o.status === "succeeded")
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const pending = allOrders.filter(o => o.status === "processing").length;

    const refunded = allOrders
      .filter(o => o.return?.status === "approved")
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonth = allOrders
      .filter(o => o.status === "succeeded" && o.createdAt >= startOfMonth)
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    reply.send({
      success: true,
      totalReceived,
      pending,
      refunded,
      thisMonth,
    });
  } catch (err) {
    console.error("Error obteniendo resumen de pagos:", err);
    reply.status(500).send({
      success: false,
      error: err.message || "Error obteniendo resumen de pagos",
    });
  }
},


};

export default ordersController;
