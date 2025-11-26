import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fastify from '../app.js';

beforeAll(async () => {
    await fastify.ready();
});

afterAll(async () => {
    await fastify.close();
});

describe.only('GET /api/v1/users', () => {
    it('Debe mostrar un objeto de usuarios y mostrar el código de estado 200', async () => {
        const res = await request(fastify.server)
            .get('/api/v1/users')
            .expect(200)
        expect(res.body).toEqual(expect.any(Object))
    });
});

describe.only('GET /api/v1/users/:id', () => {
    it('Debe mostrar un usuario por ID y mostrar el código de estado 200', async () => {
        const res = await request(fastify.server)
            .get('/api/v1/users/1')
            .expect(200)
        expect(res.body).toEqual(expect.any(Object))
    })
});



describe('PUT /api/v1/users/:id', () => {
    it('Debe actualizar un usuario por ID y mostrar el código de estado 200', async () => {
        const updatedProduct = {
            name: 'Producto Actualizado',
            price: 150,
            category: 'Categoría Actualizada',
            description: 'Descripción actualizada del usuario'
        }
        const res = await request(fastify.server)
            .put('/api/v1/users/1')
            .send(updatedProduct)
            .expect(200)

        expect(res.body).toEqual(expect.any(Object))
    })

    it.only('debería devolver 404 si el usuario no existe', async () => {
        const res = await request(fastify.server)
            .put('/api/v1/users/9999') // ID que no existe
            .send({ name: 'Producto Inexistente' })
            .expect(404);

        expect(res.text).toBe('No se encontráron recursos');
    })

    it.only('debería devolver 400 si envía el formulario vacio', async () => {
        const res = await request(fastify.server)
            .put('/api/v1/users/3')
            .send()
            .expect(400);

        expect(res.text).toBe('Error en el formulario');
    })
})

describe('DELETE /api/v1/users/:id', () => {
    it('Debe eliminar un usuario por ID y mostrar el código de estado 200', async () => {
        const res = await request(fastify.server)
            .delete('/api/v1/users/3')
            .expect(200)

        expect(res.body).toEqual(expect.any(Object))
    })

    it.only('debería devolver 404 si el usuario no existe', async () => {
        const res = await request(fastify.server)
            .delete('/api/v1/users/9999') // ID que no existe
            .expect(404);

        expect(res.text).toBe('No se encontráron recursos');
    })
})


describe('POST /api/v1/users', () => {
    it('Debe crear un nuevo usuario y mostrar el código de estado 201', async () => {
        const newUser = {
            name: 'Test Nombre Usuario',
            lastName: 'Test Apellido',
            email: 'email.test@test.com',
            password: 'password.test',
            confirmPassword: 'password.test',
        }

        const res = await request(fastify.server)
            .post('/api/v1/users')
            .send(newUser)
            .expect(201)

        const users = await request(fastify.server)
            .get('/api/v1/users');
        expect(users.body).toEqual(expect.any(Object));
        expect(users.body.users).toHaveLength(users.body.users.length);
    })

    it.only('debería devolver 400 si faltan campos', async () => {
        const res = await request(fastify.server)
            .post('/api/v1/users')
            .send({ name: 'Incomplete User' })
            .expect(400);

    })

    it.only('debería devolver 400 si las contraseñas no coinciden', async () => {
        const newUser = {
            name: 'Test Nombre Usuario',
            lastName: 'Test Apellido',
            email: 'email.test@test.com',
            password: 'password.test',
            confirmPassword: 'password.tet',
        }
        const res = await request(fastify.server)
            .post('/api/v1/users')
            .send(newUser)
            .expect(400);

    })
});

describe.only('POST /api/v1/users/login', () => {
    it('Debe iniciar sesión con un usuario existente y mostrar el código de estado 200', async () => {
        const userLogin = {
            email: 'email.test@test.com',
            password: 'password.test',
        };
        const res = await request(fastify.server)
            .post('/api/v1/users/login')
            .send(userLogin)
            .expect(200);

        expect(res.body).toEqual(expect.any(Object))

    })
    it('Debería devolver el código de estado 400 si faltan campos', async () => {
        const res = await request(fastify.server)
            .post('/api/v1/users/login')
            .send({ email: 'email.test@test.com' })
            .expect(400);

    })
    it('Debería devolver el código de estado 401 si los campos no son validos', async () => {
        const userLogin = {
            email: 'non.existing.email.test@test.com',
            password: 'password.test',
        };
        const res = await request(fastify.server)
            .post('/api/v1/users/login')
            .send(userLogin)
            .expect(401);

    })
});

describe.only('GET /api/v1/users/logout', () => {
    it('Debe cerrar sesión y mostrar el código de estado 200', async () => {
        // Primero, iniciamos sesión para asegurarnos de que hay una sesión activa
        const userLogin = {
            email: 'email.test@test.com',
            password: 'password.test'
        }
        const registerRes = await request(fastify.server)
            .post('/api/v1/users/login')
            .send(userLogin)
            .expect(200)

        const cookies = registerRes.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const res = await request(fastify.server)
            .get('/api/v1/users/logout')
            .set('Cookie', cookies)
            .expect(200);

        expect(res.text).toBe('Sesión cerrada correctamente');
    })
});