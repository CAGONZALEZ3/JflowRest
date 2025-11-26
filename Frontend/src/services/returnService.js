import axios from "axios";

const PORT = import.meta.env.VITE_SERVER_PORT;

/**
 * 🧾 Obtener todas las devoluciones (vista del administrador)
 */
export async function getAllReturns() {
  const { data } = await axios.get(`http://localhost:${PORT}/api/v1/returns`, {
    withCredentials: true,
  });
  return data;
}

/**
 * 🔍 Obtener una devolución por ID
 */
export async function getReturnById(id) {
  const { data } = await axios.get(`http://localhost:${PORT}/api/v1/returns/${id}`, {
    withCredentials: true,
  });
  return data;
}

/**
 * 📦 Crear una solicitud de devolución (usuario)
 */
export async function createReturn(payload) {
  const { data } = await axios.post(`http://localhost:${PORT}/api/v1/returns`, payload, {
    withCredentials: true,
  });
  return data;
}

/**
 * 🔄 Actualizar el estado de una devolución (admin)
 */
export async function updateReturnStatus(id, body) {
  const { data } = await axios.put(`http://localhost:${PORT}/api/v1/returns/${id}`, body, {
    withCredentials: true,
  });
  return data;
}

/**
 * ❌ Eliminar una devolución (admin)
 */
export async function deleteReturn(id) {
  const { data } = await axios.delete(`http://localhost:${PORT}/api/v1/returns/${id}`, {
    withCredentials: true,
  });
  return data;
}
