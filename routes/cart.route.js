import cartController from '../controllers/cart.controller.js';
import { isLogedIn } from '../validators/auth.validator.js';

const cartRoutes = async (fastify, options) => {

    fastify.get('/api/v1/cart', {
        handler: cartController.getCart
    });

    fastify.patch('/api/v1/cart', {
        preHandler: isLogedIn,
        handler: cartController.updateCart
    });
   
    fastify.delete('/api/v1/cart', {
        preHandler: isLogedIn,
        handler: cartController.deleteCartItem
    });

    fastify.post('/api/v1/cart/checkout', {
        handler: cartController.checkout
    });

    fastify.get('/api/v1/success', cartController.success);

    fastify.get('/api/v1/cancel', cartController.cancel);
    
}

export default cartRoutes;