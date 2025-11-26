import axios from "axios";

const PORT = import.meta.env.VITE_SERVER_PORT;

/* ----------------------------------------
 🌍 Base URL
----------------------------------------- */
const BASE_URL = `http://localhost:${PORT}/api/v1`;

/* ----------------------------------------
 🧠 Dashboard Overview (ventas, usuarios, órdenes)
----------------------------------------- */
export async function getAdminOverview(params = { days: 14 }) {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/admin/stats/overview${search ? `?${search}` : ""}`;
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Error obteniendo overview:", err);
    throw new Error("Error al cargar las estadísticas del dashboard");
  }
}

/* ----------------------------------------
 🧾 Eventos de auditoría
----------------------------------------- */
export async function getAuditEvents(params = {}) {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/admin/audit${search ? `?${search}` : ""}`;
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Error obteniendo auditoría:", err);
    throw new Error("Error al cargar los eventos de auditoría");
  }
}

/* ----------------------------------------
 📦 Productos
----------------------------------------- */
export async function getAllProducts() {
  try {
    const url = `${BASE_URL}/products`;
    const res = await axios.get(url, { withCredentials: true });
    return res;
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    throw new Error("Error al cargar los productos");
  }
}

export async function createProduct(data) {
  try {
    const res = await axios.post(`${BASE_URL}/products`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error creando producto:", err);
    const message = err.response?.data?.message || "Error al crear el producto";
    throw new Error(message);
  }
}

export async function updateProduct(id, data) {
  try {
    const res = await axios.put(`${BASE_URL}/products/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error actualizando producto:", err);
    const message =
      err.response?.data?.message || "Error al actualizar el producto";
    throw new Error(message);
  }
}

export async function deleteProduct(data) {
  try {
    const id = data._id || data.id;
    const res = await axios.delete(`${BASE_URL}/products/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error eliminando producto:", err);
    throw new Error("Error al eliminar el producto");
  }
}

/* ----------------------------------------
 👤 Usuarios
----------------------------------------- */
export async function getAllUsers() {
  try {
    const url = `${BASE_URL}/users`;
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Error obteniendo usuarios:", err);
    throw new Error("Error al cargar los usuarios");
  }
}

export async function getUserById(id) {
  try {
    const res = await axios.get(`${BASE_URL}/users/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    throw new Error("Error al obtener los datos del usuario");
  }
}

export async function createUser(data) {
  try {
    const res = await axios.post(`${BASE_URL}/users`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error creando usuario:", err);
    const message =
      err.response?.data?.message || "Error al crear el usuario";
    throw new Error(message);
  }
}

export async function updateUserProfile(id, data) {
  try {
    const res = await axios.patch(`${BASE_URL}/users/${id}/profile`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    const message =
      err.response?.data?.message || "Error al actualizar el usuario";
    throw new Error(message);
  }
}

export async function deleteUser(data) {
  try {
    const id = data._id || data.id;
    const res = await axios.delete(`${BASE_URL}/users/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error eliminando usuario:", err);
    throw new Error("Error al eliminar el usuario");
  }
}

/* ----------------------------------------
 🔁 Devoluciones
----------------------------------------- */
export async function getAllReturns() {
  try {
    const url = `${BASE_URL}/returns`;
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Error obteniendo devoluciones:", err);
    throw new Error("Error al cargar las devoluciones");
  }
}

export const getPaymentsSummary = async () => {
  try {
    const res = await axios.get(`${PORT}/api/v1/payments/summary`);
    return res.data;
  } catch (err) {
    console.error("Error obteniendo resumen de pagos:", err);
    return { totalReceived: 0, pending: 0, refunded: 0, thisMonth: 0 };
  }
};