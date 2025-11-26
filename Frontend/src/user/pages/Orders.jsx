import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaChevronRight,
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaMapMarkerAlt,
  FaRedo,
  FaBoxOpen,
  FaShippingFast,
} from "react-icons/fa";
import SidebarProfile from "../../shared/components/SidebarProfile";

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const PORT = import.meta.env.VITE_SERVER_PORT;

  useEffect(() => {
    const stored =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:${PORT}/api/v1/orders/user`, {
        withCredentials: true,
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error obteniendo pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReturn = async (orderId) => {
    if (!reason.trim()) {
      alert("Por favor indica el motivo de la devolución.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:${PORT}/api/v1/returns`,
        { order_id: orderId, reason },
        { withCredentials: true }
      );
      alert("Solicitud de devolución enviada correctamente ✅");
      setReason("");
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Error al solicitar devolución");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Cargando tus pedidos…</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-red-50/40">
      <Navbar bw />

      <main className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 py-20">
        {/* Encabezado superior */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Mis órdenes
            </h2>
            <p className="text-sm text-gray-500">
              Consulta tus pedidos, estados y devoluciones.
            </p>
          </div>
        </div>

        {/* Barra horizontal de navegación */}
        <SidebarProfile/>

        {/* Sección principal */}
        <section className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-red-100 p-10">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 gap-1 mb-6">
            <Link to="/" className="hover:text-red-600 transition">
              Inicio
            </Link>
            <FaChevronRight size={10} />
            <span>Mi cuenta</span>
            <FaChevronRight size={10} />
            <span className="text-red-600 font-medium">Mis órdenes</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-gray-700 bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
              <p>No tienes pedidos registrados aún.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  navigate={navigate}
                  setSelectedOrder={setSelectedOrder}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal de devolución */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md border border-red-100">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Solicitar devolución
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Indica el motivo de la devolución para la orden #
              {selectedOrder._id.slice(-6)}.
            </p>
            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motivo de devolución..."
              className="w-full border border-red-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRequestReturn(selectedOrder._id)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full"
              >
                Enviar solicitud
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer bw />
    </div>
  );
}

/* ----------------- Subcomponentes ----------------- */

function OrderCard({ order, navigate, setSelectedOrder }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="font-bold text-gray-800">
            Pedido #{order._id.slice(-6)}
          </h2>
          <p className="text-sm text-gray-500">
            Fecha: {new Date(order.createdAt).toLocaleDateString("es-ES")}
          </p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      {/* Detalles principales */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <h3 className="text-2xl font-bold text-gray-800">
            ${order.amount?.toFixed(2) || "0.00"}
          </h3>
        </div>
        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
          <span className="font-medium">Tracking:</span>{" "}
          {order.tracking?.code || "N/A"}
        </div>
      </div>

      {/* Progreso de envío */}
      <ShipmentProgress status={order.tracking?.status} />

      {/* Acciones */}
      <div className="flex justify-between items-center mt-5">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Estado envío:</span>{" "}
          <ShipmentStatus status={order.tracking?.status} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/order-tracking/${order._id}`)}
            className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"
          >
            <FaMapMarkerAlt size={12} /> Ver mapa
          </button>
          {order.status === "succeeded" && order.return?.status === "none" && (
            <button
              onClick={() => setSelectedOrder(order)}
              className="text-sm text-gray-600 font-medium hover:text-red-600 flex items-center gap-1"
            >
              <FaRedo size={12} /> Devolver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Estado de orden */
function OrderStatus({ status }) {
  const map = {
    succeeded: { text: "Completado", class: "bg-green-100 text-green-700" },
    cancelled: { text: "Cancelado", class: "bg-red-100 text-red-700" },
    pending: { text: "Pendiente", class: "bg-yellow-100 text-yellow-700" },
  };
  const s =
    map[status] || { text: "Procesando", class: "bg-gray-100 text-gray-700" };
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.class}`}
    >
      {s.text}
    </span>
  );
}

/* Estado de envío */
function ShipmentStatus({ status }) {
  const map = {
    delivered: { text: "Entregado", color: "text-green-700" },
    in_transit: { text: "En tránsito", color: "text-yellow-600" },
    shipped: { text: "Enviado", color: "text-blue-600" },
    processing: { text: "Procesando", color: "text-red-600" },
  };
  const s = map[status] || map.processing;
  return <span className={`font-medium ${s.color}`}>{s.text}</span>;
}

/* Barra de progreso dinámica con íconos */
function ShipmentProgress({ status }) {
  const progressMap = {
    processing: { value: 25, label: "Procesando", icon: <FaBoxOpen /> },
    shipped: { value: 50, label: "Enviado", icon: <FaTruck /> },
    in_transit: { value: 75, label: "En tránsito", icon: <FaShippingFast /> },
    delivered: { value: 100, label: "Entregado", icon: <FaCheckCircle /> },
  };

  const current = progressMap[status] || progressMap.processing;
  const color =
    current.value === 100
      ? "bg-green-600"
      : "bg-gradient-to-r from-red-500 to-red-400";

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Procesando</span>
        <span>Enviado</span>
        <span>En tránsito</span>
        <span>Entregado</span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-700`}
          style={{ width: `${current.value}%` }}
        ></div>

        <div className="absolute inset-0 flex justify-between items-center px-1">
          {Object.keys(progressMap).map((key) => {
            const step = progressMap[key];
            const active = step.value <= current.value;
            return (
              <div
                key={key}
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                  active
                    ? "bg-red-500 text-white shadow-md animate-pulse"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.icon}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
        <span>Estado envío:</span>
        <span
          className={`font-semibold capitalize ${
            current.value === 100 ? "text-green-600" : "text-red-600"
          }`}
        >
          {current.label}
        </span>
      </div>
    </div>
  );
}
