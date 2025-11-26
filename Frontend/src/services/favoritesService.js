import axios from "axios";

const PORT = import.meta.env.VITE_SERVER_PORT;

export async function getFavorites() {
  const res = await axios.get(`http://localhost:${PORT}/api/v1/favorites`, {
    withCredentials: true
  });
  return res.data;
}

export async function addToFavorites(data) {
  const res = await axios.patch(`http://localhost:${PORT}/api/v1/favorites`, data, {
    withCredentials: true
  });
  return res.data;
}

export async function removeFromFavorites(data) {
  const res = await axios.delete(`http://localhost:${PORT}/api/v1/favorites`, {
    data,
    withCredentials: true
  });
  return res.data;
}

