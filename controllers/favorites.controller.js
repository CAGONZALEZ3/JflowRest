import { Favorite } from '../models/favorite.model.js';
import { logAudit } from '../utils/audit.js';

const favoritesController = {

  getFavorites: async (request, reply) => {
    const user = request.session.user;
    if (!user) return { items: [] };
    try {
      const fav = await Favorite.findOne({ user_id: user.id })
        .populate('user_id', ['name', 'lastName', 'email'])
        .populate('items.product_id')
        .populate('items.product_variant_id');
      return fav || { items: [] };
    } catch (err) {
      reply.status(500).send('Error al obtener favoritos');
    }
  },

  updateFavorites: async (request, reply) => {
    const user = request.session.user;
    if (!user) return reply.code(401).send('No autenticado');
    try {
      const payload = request.body?.items;
      const items = Array.isArray(payload) ? payload : (payload ? [payload] : []);
      if (!items.length) return reply.code(400).send('Sin items para agregar');
      const current = await Favorite.findOne({ user_id: user.id });
      const currentItems = current?.items || [];
      const existingSet = new Set(currentItems.map(i => String(i.product_variant_id)));
      const toAdd = items.filter(i => !existingSet.has(String(i.product_variant_id)));

      if (toAdd.length === 0) return reply.code(200).send('Ya en favoritos');

      const updated = await Favorite.findOneAndUpdate(
        { user_id: user.id },
        { $setOnInsert: { user_id: user.id }, $push: { items: { $each: toAdd } } },
        { new: true, upsert: true }
      );
      if (!updated) return reply.code(404);
      await logAudit({ req: request, action: 'favorites_updated', entityType: 'favorites', entityId: user.id, meta: { added: toAdd.length } });
      reply.code(200).send('Favoritos actualizados');
    } catch (err) {
      reply.status(500).send('Error al actualizar favoritos');
    }
  },

  deleteFavoriteItem: async (request, reply) => {
    const user = request.session.user;
    if (!user) return reply.code(401).send('No autenticado');
    try {
      const item = request.body;
      await Favorite.findOneAndUpdate(
        { user_id: user.id },
        { $pull: { items: item } },
        { new: true }
      );
      await logAudit({ req: request, action: 'favorite_removed', entityType: 'favorites', entityId: user.id, meta: item });
      reply.code(200).send('Item eliminado de favoritos');
    } catch (err) {
      reply.status(500).send('Error al eliminar de favoritos');
    }
  }
}

export default favoritesController;
