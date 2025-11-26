import mongoose, { Schema } from "mongoose";

const variantSchema = new Schema({
    sku: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String]
}, { timestamps: true });

export const ProductVariant = mongoose.model('products_variants', variantSchema);