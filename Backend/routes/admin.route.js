import adminController from '../controllers/admin.controller.js';
import { isLogedIn } from '../validators/auth.validator.js';

// Helper para restringir a admin. Acepta los dos estilos usados en el repo:
// - role === 1 (histórico del validador isAdmin)
// - role 1xx (100..199) usado en login para redirección
const requireAdmin = async (req, reply) => {
  const user = req?.session?.user;
  if (!user) return reply.code(401).send({ message: 'No Autorizado' });
  const role = Number(user.role);
  const isAdminRole = role === 1 || (/^1\d{2}$/.test(String(role)));
  if (!isAdminRole) {
    return reply.code(403).send('Acceso denegado');
  }
};

const adminRoutes = async (fastify, options) => {
  fastify.get('/api/v1/admin/stats/overview', { preHandler: [isLogedIn, requireAdmin], handler: adminController.getOverview });
  fastify.get('/api/v1/admin/orders', { preHandler: [isLogedIn, requireAdmin], handler: adminController.getOrdersHistory });
  fastify.get('/api/v1/admin/users/history', { preHandler: [isLogedIn, requireAdmin], handler: adminController.getUsersHistory });
  fastify.get('/api/v1/admin/audit', { preHandler: [isLogedIn, requireAdmin], handler: adminController.getAuditEvents });
};

export default adminRoutes;
