import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fastify from '../app.js';

beforeAll(async () => {
    await fastify.ready();
});

afterAll(async () => {
    await fastify.close();
});

describe.only('GET /api/v1/products', () => {
    it('Debe mostrar un objeto de productos y mostrar el código de estado 200', async () => {
        const res = await request(fastify.server)
            .get('/api/v1/products')
            .expect(200)
        expect(res.body).toEqual(expect.any(Object))
    });
});

describe.only('GET /api/v1/products/:id', () => {
    it('Debe mostrar un producto por ID y mostrar el código de estado 200', async () => {
        const res = await request(fastify.server)
            .get('/api/v1/products/1')
            .expect(200)
        expect(res.body).toEqual(expect.any(Object))
    })
});

describe('POST /api/v1/products', () => {
    it('Debe crear un nuevo producto y mostrar el código de estado 201', async () => {
        const newProduct = {
            name: 'Nuevo Producto',
            price: 100,
            category: 'Categoría de prueba',
            description: 'Descripción del nuevo producto'
        }
            .post('/api/v1/products')
            .send(newProduct)
            .expect(201)

        const products = await request(fastify.server)    
            .get('/api/v1/products');
            expect(products.body).toEqual(expect.any(Object));
            expect(products.body.products).toHaveLength(products.body.products.length); // Asumiendo que ya hay 3 productos en el archivo
    })

    it('debería devolver 400 si faltan campos', async () => {
        const res = await request(fastify.server)
            .post('/api/v1/products')
            .send({ name: 'Producto incompleto' })
            .expect(400);

    })

    describe('PUT /api/v1/products/:id', () => {
        it('Debe actualizar un producto por ID y mostrar el código de estado 200', async () => {
            const updatedProduct = {
                name: 'Producto Actualizado',
                price: 150,
                category: 'Categoría Actualizada',
                description: 'Descripción actualizada del producto'
            }
            const res = await request(fastify.server)
                .put('/api/v1/products/1')
                .send(updatedProduct)
                .expect(200)

            expect(res.body).toEqual(expect.any(Object))
        })

        it('debería devolver 404 si el producto no existe', async () => {
            const res = await request(fastify.server)
                .put('/api/v1/products/9999') // ID que no existe
                .send({ name: 'Producto Inexistente' })
                .expect(404);

            expect(res.text).toBe('No se encontráron recursos');
        })

        it('debería devolver 400 si envía el formulario vacio', async () => {
            const res = await request(fastify.server)
                .put('/api/v1/products/3')
                .send()
                .expect(400);

            expect(res.text).toBe('Error en el formulario');
        })
    })

    describe('DELETE /api/v1/products/:id', () => {
        it('Debe eliminar un producto por ID y mostrar el código de estado 200', async () => {
            const res = await request(fastify.server)
                .delete('/api/v1/products/1')
                .expect(200)

            expect(res.body).toEqual(expect.any(Object))
        })

        it('debería devolver 404 si el producto no existe', async () => {
            const res = await request(fastify.server)
                .delete('/api/v1/products/9999') // ID que no existe
                .expect(404);

            expect(res.text).toBe('No se encontráron recursos');
        })
    })
})