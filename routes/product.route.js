import productController from '../controllers/product.controller.js';

const productRoutes = async(fastify, options) => {
    fastify.get('/api/v1/products', productController.getProducts);
    fastify.get('/api/v1/products/:id', productController.getProduct);
    fastify.post('/api/v1/products', productController.storeProduct);
    fastify.put('/api/v1/products/:id', productController.updateProduct);
    fastify.delete('/api/v1/products/:id', productController.deleteProduct);
}

export default productRoutes;