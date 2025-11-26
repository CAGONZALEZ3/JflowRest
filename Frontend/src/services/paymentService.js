import axios from 'axios';

const PORT = import.meta.env.VITE_SERVER_PORT;

export const checkout = async (data) => {
    try {
        const res = await axios.post(`http://localhost:${PORT}/api/v1/cart/checkout`, data, { withCredentials: true });
        if (res.status === 200) return res.data.url
    } catch (err) {
        console.error("Error iniciando session de compra", err);
        throw err
    }
}
