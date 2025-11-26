import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { ProductVariant } from '../models/productVariant.model.js';
import { SubCategory } from '../models/subCategory.model.js';
import { logAudit } from '../utils/audit.js';


function generateSku(name, color, size) {

    const nameId = (name.replace(/\s+/g, '').toUpperCase() + 'XXXXX').slice(0, 5);
    const colorId = (color.replace(/\s+/g, '').toUpperCase() + 'YYYYY').slice(0, 4);
    const sizeId = (size.replace(/\s+/g, '').toUpperCase() + 'Z').slice(0, 1);
    return `${nameId}-${colorId}-${sizeId}`;
}

const productController = {

    getProducts: async (request, reply) => {
        const products = await Product.find()
            .populate('sub_category_id')
            .populate('variants');
        if (!products) return reply.status(404).send("No se encontraron recursos");
        return reply.code(200).send({
            count: products.length,
            products: products
        });
    },


    getProduct: async (request, reply) => {
        const id = request.params.id;
        const product = await Product.findById(id)
            .populate('sub_category_id')
            .populate('variants');
        if (!product) return reply.status(404).send("No se encontraron recursos");
        return reply.code(200).send(product);
    },


    storeProduct: async (request, reply) => {
        const product = request.body;
        if (!product) return reply.code(400).send('Error en el formulario');

        try {
            const category = await Category.findOne({ name: product.category });

            if (!category) return reply.code(400).send('Categoría no encontrada');

            let subCategory = await SubCategory.findOne({ slug: product.subCategory }).where('parent_id').equals(category._id);

            if (!subCategory) return reply.code(400).send('Subcategoría no encontrada');

            if (!subCategory.parent_id) {
                subCategory.parent_id = category._id;
                await subCategory.save();
            }
            const variantsData = (product.variants || []).map(v => ({
                ...v,
                sku: generateSku(product.name, v.color, v.size)
            }));
            const variants = await ProductVariant.insertMany(variantsData);
            const created = await Product.create({
                name: product.name,
                description: product.description,
                sub_category_id: subCategory._id,
                variants: variants.map(variant => variant._id)
            });
            await logAudit({ req: request, action: 'product_created', entityType: 'product', entityId: created._id, after: { name: product.name } });
            reply.code(201).send('Producto creado satisfactoriamente');
        } catch (err) {
            console.error(err);
            reply.code(500).send('Error al crear producto');
        }
    },


    updateProduct: async (request, reply) => {
        const id = request.params.id;
        const data = request.body;

        if (!data) return reply.code(400).send('Error en el formulario');
        try {
            // Actualizar variantes si existen
            let variantIds = [];
            if (Array.isArray(data.variants)) {
                variantIds = [];
                for (const v of data.variants) {
                    if (v._id) {
                        // Actualizar variante existente
                        await ProductVariant.findByIdAndUpdate(v._id, v, { new: true });
                        variantIds.push(v._id);
                    } else {
                        // Crear nueva variante
                        const newVariant = await ProductVariant.create(v);
                        variantIds.push(newVariant._id);
                    }
                }
            }
            const category = await Category.findOne({ name: data.category });

            if (!category) return reply.code(400).send('Categoría no encontrada');

            let subCategory = await SubCategory.findOne({ slug: data.subCategory }).where('parent_id').equals(category._id);

            if (!subCategory) return reply.code(400).send('Subcategoría no encontrada');

            if (!subCategory.parent_id) {
                subCategory.parent_id = category._id;
                await subCategory.save();
            }
            // Actualizar el producto principal
            const product = await Product.findByIdAndUpdate(
                id,
                {
                    name: data.name,
                    description: data.description,
                    sub_category_id: subCategory._id,
                    variants: variantIds.length ? variantIds : undefined
                },
                { new: true }
            );

            if (!product) return reply.code(404).send('No se encontraron recursos');
            await logAudit({ req: request, action: 'product_updated', entityType: 'product', entityId: id, meta: { variantsUpdated: variantIds.length }, after: { name: data.name } });
            reply.code(200).send('Producto actualizado correctamente');
        } catch (err) {
            console.error(err);
            reply.code(500).send('Error al actualizar producto');
        }
    },


    deleteProduct: async (request, reply) => {
        const id = request.params.id;
        const product = await Product.findById(id);
        if (!product) return reply.code(404).send('No se encontraron recursos');

        if (Array.isArray(product.variants) && product.variants.length > 0) {
            await ProductVariant.deleteMany({ _id: { $in: product.variants } });
        }
        await Product.findByIdAndDelete(id);
        await logAudit({ req: request, action: 'product_deleted', entityType: 'product', entityId: id });
        reply.code(200).send('Producto y variantes eliminados');
    }
};

export default productController;
