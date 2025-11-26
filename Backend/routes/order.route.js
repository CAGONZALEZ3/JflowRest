import orderController from "../controllers/order.controller.js";

const ordersRoutes = async (fastify, options) => {
  // 📋 Rutas generales
  fastify.get("/api/v1/orders", orderController.getAllOrders);
  fastify.get("/api/v1/orders/:id", orderController.getOrderById);
  fastify.put("/api/v1/orders/:id", orderController.updateOrderStatus);
  fastify.delete("/api/v1/orders/:id", orderController.deleteOrder);

  // 📋 Rutas del usuario autenticado
  fastify.get("/api/v1/orders/user", orderController.getUserOrders);
  fastify.get("/api/v1/payments/summary", orderController.getPaymentsSummary);


  // 🚚 Tracking
  fastify.get("/api/v1/orders/:id/tracking", orderController.getOrderTracking);
  fastify.put("/api/v1/orders/:id/tracking", orderController.updateOrderLocation);
};

export default ordersRoutes;
 