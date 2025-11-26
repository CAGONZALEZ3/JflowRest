import mongoose, { Schema, model } from "mongoose";

// --- Subdocumento de devoluciones ---
const returnSchema = new Schema(
  {
    requested: { type: Boolean, default: false },
    reason: { type: String },
    status: {
      type: String,
      enum: ["none", "requested", "approved", "rejected"],
      default: "none",
    },
    responseMessage: { type: String },
    requestedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { _id: false }
);

// --- Subdocumento de tracking ---
const trackingSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["processing", "shipped", "in_transit", "delivered"],
      default: "processing",
    },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    destination: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    history: [
      {
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { _id: false }
);

// --- Esquema principal de Orden ---
const orderSchema = new Schema(
  {
    checkout_session: { type: Object },
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    status: { type: String, default: "succeeded" },
    products: [
      {
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    amount: { type: Number },
    address: { type: String },
    return: { type: returnSchema, default: { status: "none" } },
    tracking: { type: trackingSchema, default: { status: "processing" } },
  },
  { timestamps: true }
);

export const Order = model("orders", orderSchema);
