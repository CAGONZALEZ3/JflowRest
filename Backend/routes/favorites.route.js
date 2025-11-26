import favoritesController from '../controllers/favorites.controller.js';
import { isLogedIn } from '../validators/auth.validator.js';

const favoritesRoutes = async (fastify, options) => {
  fastify.get('/api/v1/favorites', {
    handler: favoritesController.getFavorites
  });

  fastify.patch('/api/v1/favorites', {
    preHandler: isLogedIn,
    handler: favoritesController.updateFavorites
  });

  fastify.delete('/api/v1/favorites', {
    preHandler: isLogedIn,
    handler: favoritesController.deleteFavoriteItem
  });
}

export default favoritesRoutes;

