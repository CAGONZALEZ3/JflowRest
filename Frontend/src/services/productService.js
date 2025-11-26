import axios from 'axios';

const PORT = import.meta.env.VITE_SERVER_PORT;

export async function getAllProducts() {
  try {
    const res = await axios.get(`http://localhost:${PORT}/api/v1/products`, {
      withCredentials: true
    });
    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Error al obtener productos");
  }
}


export async function getProductById(id) {
  try {
    const res = await axios.get(`http://localhost:${PORT}/api/v1/products/${id}`, {
      withCredentials: true
    });
    if (res.status === 200) {
      return res.data;
    }
  }
  catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Error al obtener el producto");
  }
}


