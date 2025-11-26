import userController from '../controllers/user.controller.js';
import { registerSchema, loginSchema, profilePatchSchema } from '../validators/user.validator.js';
import { isLogedIn } from '../validators/auth.validator.js';

const userRoutes = async (fastify, options) => {

    fastify.get('/api/v1/users', userController.getUsers);
    fastify.get('/api/v1/users/:id', userController.getUser);
    fastify.delete('/api/v1/users/:id', userController.deleteUser);

    // >>> Rutas de sesión <<<
    fastify.post('/api/v1/users', {
        schema: registerSchema,
        handler: userController.storeUser
    });

    fastify.post('/api/v1/users/login', {
        schema: loginSchema,
        handler: userController.loginUser
    });

    fastify.get('/api/v1/users/:id/profile', {
        preHandler: isLogedIn,
        handler: userController.showUserProfile
    });

    fastify.patch('/api/v1/users/:id/profile', {
        schema: profilePatchSchema,
        handler: userController.updateUserProfile
    });

    fastify.get('/api/v1/users/logout', userController.logoutUser);

}

export default userRoutes;