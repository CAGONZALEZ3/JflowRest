import axios from "axios";

const PORT = import.meta.env.VITE_SERVER_PORT;

// 🧩 Obtener todos los pedidos
export async function getAllOrders() {
  try {
    const response = await axios.get(`http://localhost:${PORT}/api/v1/orders`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    throw error;
  }
}

// 🔄 Actualizar el estado de un pedido
export async function updateOrderStatus(id, status) {
  try {
    const response = await axios.put(
      `http://localhost:${PORT}/api/v1/orders/${id}`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    throw error;
  }
}

// 🗑️ Eliminar un pedido
export async function deleteOrder(id) {
  try {
    const response = await axios.delete(
      `http://localhost:${PORT}/api/v1/orders/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el pedido:", error);
    throw error;
  }
}
