import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { AuditEvent } from '../models/auditEvent.model.js';

const toObjectId = (v) => {
  try { return new mongoose.Types.ObjectId(String(v)); } catch { return null; }
};

const adminController = {
  // Estadísticas generales + series cortas para dashboard
  getOverview: async (request, reply) => {
    const days = Math.min(Number(request.query?.days || 14), 90);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalUsers, totalProducts, totalOrders, ordersByStatus, revenueSeries, signupsSeries] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: 'succeeded', createdAt: { $gte: since } } },
        { $project: { day: { $dateTrunc: { date: '$createdAt', unit: 'day' } }, amount: '$checkout_session.amount_total' } },
        { $group: { _id: '$day', revenue: { $sum: '$amount' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $project: { day: { $dateTrunc: { date: '$createdAt', unit: 'day' } } } },
        { $group: { _id: '$day', signups: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return reply.send({
      totals: { users: totalUsers, products: totalProducts, orders: totalOrders },
      ordersByStatus: ordersByStatus.reduce((acc, it) => ({ ...acc, [it._id || 'unknown']: it.count }), {}),
      revenueSeries, // amounts in cents
      signupsSeries,
    });
  },

  // Historial de pedidos (paginado)
  getOrdersHistory: async (request, reply) => {
    const page = Math.max(Number(request.query?.page || 1), 1);
    const limit = Math.min(Number(request.query?.limit || 20), 100);
    const skip = (page - 1) * limit;
    const status = request.query?.status;

    const filter = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Order.find(filter)
        .populate('user_id', ['name', 'lastName', 'email'])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return reply.send({ page, limit, total, items });
  },

  // Historial de usuarios (paginado por eventos de auditoría relevantes)
  getUsersHistory: async (request, reply) => {
    const page = Math.max(Number(request.query?.page || 1), 1);
    const limit = Math.min(Number(request.query?.limit || 20), 100);
    const skip = (page - 1) * limit;
    const userId = request.query?.user_id && toObjectId(request.query.user_id);

    const filter = { entity_type: { $in: ['user', 'session'] } };
    if (userId) filter.actor_id = userId;

    const [items, total] = await Promise.all([
      AuditEvent.find(filter).sort({ occurred_at: -1 }).skip(skip).limit(limit),
      AuditEvent.countDocuments(filter),
    ]);

    return reply.send({ page, limit, total, items });
  },

  // Consulta genérica de auditoría con filtros
  getAuditEvents: async (request, reply) => {
    const page = Math.max(Number(request.query?.page || 1), 1);
    const limit = Math.min(Number(request.query?.limit || 50), 200);
    const skip = (page - 1) * limit;
    const { action, entity_type, actor_id, from, to } = request.query || {};

    const filter = {};
    if (action) filter.action = action;
    if (entity_type) filter.entity_type = entity_type;
    if (actor_id) {
      const oid = toObjectId(actor_id);
      if (oid) filter.actor_id = oid;
    }
    if (from || to) {
      filter.occurred_at = {};
      if (from) filter.occurred_at.$gte = new Date(from);
      if (to) filter.occurred_at.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      AuditEvent.find(filter).sort({ occurred_at: -1 }).skip(skip).limit(limit),
      AuditEvent.countDocuments(filter),
    ]);

    return reply.send({ page, limit, total, items });
  },
};

export default adminController;

