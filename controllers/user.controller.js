import { ObjectId } from 'mongodb';
import { Cart } from '../models/cart.model.js';
import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { logAudit } from '../utils/audit.js';

const userController = {

    getUsers: async (request, reply) => {
        const users = await User.find();
        return reply.send({
            count: users.length,
            users: users
        });
    },

    getUser: async (request, reply) => {
        const id = request.params.id;
        const user = await User.findById(id);
        if (!user) return reply.status(404).send("No se encontraron recursos");
        return reply.send(user);
    },

    deleteUser: async (request, reply) => {
        const id = request.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) return reply.code(404).send('No se encontraron recursos');
        reply.code(200).send('Usuario eliminado');
    },

    // >>> Rutas de Sesión <<<

    storeUser: async (request, reply) => {
        const { name, lastName, email, password, confirmPassword } = request.body;
        if (!name || !lastName || !email || !password || !confirmPassword) {
            return reply.code(400).send('Todos los campos son requeridos');
        }
        if (await User.findOne({ email })) {
            return reply.code(400).send('El email ya está registrado');
        }
        if (password !== confirmPassword) return reply.code(400).send('Error al ingresar contraseñas');
        try {
            const hashedPassword = await hashPassword(password);
            const newUser = await User.create({
                name,
                lastName,
                email,
                password: hashedPassword,
                phone_number: "",
                birth_date: Date(),
                gender: "",
                address: {
                    street: "",
                    postal_code: "",
                    state: "",
                    country: ""
                },
                role: 200,
            });

            await Cart.create({
                user_id: new ObjectId(newUser._id),
                items: []
            });
            // Iniciar sesión automáticamente después del registro
            request.session.user = {
                id: newUser._id,
                name: newUser.name,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            };
            request.session.save();

            await logAudit({
                req: request,
                action: 'user_registered',
                entityType: 'user',
                entityId: newUser._id,
                actorName: `${newUser.name} ${newUser.lastName}`,
                actorEmail: newUser.email,
                after: { id: newUser._id, email: newUser.email }
            });
            await logAudit({
                req: request,
                action: 'user_logged_in',
                entityType: 'session',
                entityId: newUser._id,
                actorName: `${newUser.name} ${newUser.lastName}`,
                actorEmail: newUser.email,
            });

            reply.code(201).send({ user: request.session.user, redirectTo: '/Home' });
        } catch (err) {
            console.error(err);
            reply.code(500).send('Error al registrar usuario');
        }
    },

    loginUser: async (request, reply) => {
        const { email, password } = request.body;
        if (!email || !password) return reply.code(400).send('Email y contraseña son requeridos');
        const user = await User.findOne({ email });
        if (!user) return reply.code(401).send('Email o contraseña incorrectos');
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) return reply.code(401).send('Email o contraseña incorrectos');
        const redirect = /^1\d{2}$/.test(user.role) ? '/Dashboard' : '/Home';
        // Iniciar sesión
        request.session.user = {
            id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };
        request.session.save();

        await logAudit({
            req: request,
            action: 'user_logged_in',
            entityType: 'session',
            entityId: user._id,
            actorName: `${user.name} ${user.lastName}`,
            actorEmail: user.email,
        });

        reply.code(200).send({ user: request.session.user, redirectTo: redirect });
    },

    logoutUser: async (request, reply) => {
        if (!request.session.user) return reply.code(400).send('No hay sesión activa');
        // Cerrar sesión
        const actorId = request.session.user.id;
        request.session.destroy(err => {
            if (err) {
                console.error(err);
                return reply.code(400).send('Error al cerrar sesión');
            }
            logAudit({ req: request, action: 'user_logged_out', entityType: 'session', entityId: actorId });
            reply.code(200).send('Sesión cerrada correctamente');
        })
    },

    showUserProfile: async (request, reply) => {
        const id = request.params.id;
        try {
            const user = await User.findById(id, { password: 0, role: 0, __v: 0 });
            if (!user) return reply.status(404).send("No se encontraron recursos");
            return reply.code(200).send(user);
        } catch (err) {
            reply.code(404).send('Usuario no encontrado')
        }

    },

    updateUserProfile: async (request, reply) => {
        const id = request.params.id;
        try {
            if (!request.body) return reply.code(400).send('Error en el formulario');
            
            const allowed = ['name', 'lastName', 'phone_number', 'birth_date', 'gender'];
            const updates = allowed.reduce((acc, key) => {
                if (request.body[key] !== undefined) acc[key] = request.body[key];
                return acc;
            }, {});
            const user = await User.findByIdAndUpdate(id,
                { $set: updates },
                { new: true });
            if (!user) return reply.code(404).send('No se encontraron recursos');

            request.session.user.name = updates.name
            request.session.user.lastName = updates.lastName

            await logAudit({
                req: request,
                action: 'user_profile_updated',
                entityType: 'user',
                entityId: id,
                meta: { fields: Object.keys(updates) },
                after: updates
            });

            reply.code(200).send({ user: request.session.user, redirectTo: '/Profile' });

        } catch (err) {
            reply.code(500).send("No se pudo realizar cambios")
        }
    },

}

export default userController;    
