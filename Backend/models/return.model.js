import { Schema, model } from 'mongoose';

const returnItemSchema = new Schema(
  {
    name: String,
    quantity: Number,
    price: Number,
  },
  { _id: false }
);


const returnSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'orders', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    reason: { type: String },
    method: { type: String, enum: ['refund', 'exchange'], default: 'refund' },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    refund_amount: Number,
    notes: String,
    status: { type: String, default: 'requested' }, // requested, approved, refunded, rejected, etc.
  },
  { timestamps: true }
);

export const Return = model('returns', returnSchema);

