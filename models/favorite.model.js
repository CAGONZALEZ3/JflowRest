import mongoose, { Schema } from "mongoose";

const favoriteItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  product_variant_id: { type: Schema.Types.ObjectId, ref: 'products_variants', required: true },
}, { _id: false });

const favoriteSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
  items: [favoriteItemSchema]
}, { timestamps: true });

export const Favorite = mongoose.model('favorite', favoriteSchema);

