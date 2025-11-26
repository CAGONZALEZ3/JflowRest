import mongoose, { Schema } from "mongoose";
import { ProductVariant } from '../models/productVariant.model.js';

const cartItemSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    product_variant_id: { type: Schema.Types.ObjectId, ref: 'products_variants', required: true },
    quantity: { type: Number, required: true, min: 1 }
});
const cartSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    items: [cartItemSchema]
}, { timestamps: true });

export const Cart = mongoose.model('cart', cartSchema);