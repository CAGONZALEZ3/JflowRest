import mongoose from "mongoose";
import {Cart} from '../models/cart.model.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: String,
  birth_date: Date,
  gender: String,
  address: {
    country: String,
    postal_code: String,
    state: String,
    street: String
  },
  role: Number
}, { timestamps: true });

const User = mongoose.model("users", userSchema);
export default User;
