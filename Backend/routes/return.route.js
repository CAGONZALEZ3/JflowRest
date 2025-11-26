import returnController from "../controllers/return.controller.js";

const returnRoutes = async (fastify, options) => {
  // 📋 Obtener todas las devoluciones (vista del administrador)
  fastify.get("/api/v1/returns", returnController.getAll);

  // 🔍 Obtener una devolución por ID (detalle individual)
  fastify.get("/api/v1/returns/:id", returnController.getById);

  // 📨 Crear una devolución (solicitud del usuario)
  fastify.post("/api/v1/returns", returnController.create);

  // 🔄 Actualizar estado de una devolución (admin)
  fastify.put("/api/v1/returns/:id", returnController.updateStatus);

  // 🗑️ Eliminar devolución (admin)
  fastify.delete("/api/v1/returns/:id", returnController.remove);
};

export default returnRoutes;
