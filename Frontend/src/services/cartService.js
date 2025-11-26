// src/services/cartService.js
import axios from "axios";

const PORT = import.meta.env.VITE_SERVER_PORT;

export async function getCart() {
  try {
    const response = await axios.get(`http://localhost:${PORT}/api/v1/cart`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    throw error;
  }
}

export async function addToCart(data) {
  try {
    const response = await axios.patch(`http://localhost:${PORT}/api/v1/cart`, data, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    throw error;
  }
}

export async function updateCart(data) {
  try {
    const response = await axios.patch(`http://localhost:${PORT}/api/v1/cart`, data, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    throw error;
  }
}

export async function removeFromCart(data) {
  try {
    const response = await axios.delete(`http://localhost:${PORT}/api/v1/cart`, {
      data,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    throw error;
  }
}
