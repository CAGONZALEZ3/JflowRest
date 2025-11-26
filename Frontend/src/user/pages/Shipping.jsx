import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import SidebarProfile from "../../shared/components/SidebarProfile";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaChevronRight,
  FaTruck,
  FaShippingFast,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Shipping() {
  const [user, setUser] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const PORT = import.meta.env.VITE_SERVER_PORT;

  useEffect(() => {
    const stored =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) fetchShipments();
  }, [user]);

  const fetchShipments = async () => {
    try {
      const res = await axios.get(`http://localhost:${PORT}/api/v1/shipments/user`, {
        withCredentials: true,
      });
      setShipments(res.data.shipments || []);
    } catch (err) {
      console.error("Error obteniendo envíos:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Cargando tus envíos…</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-red-50/40">
      <Navbar bw />

      <main className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 py-20">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Mis envíos</h2>
            <p className="text-sm text-gray-500">
              Consulta el estado y los detalles de tus envíos.
            </p>
          </div>
        </div>

        {/* Barra de navegación lateral */}
        <SidebarProfile />

        {/* Contenido principal */}
        <section className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-red-100 p-10">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 gap-1 mb-6">
            <Link to="/" className="hover:text-red-600 transition">
              Inicio
            </Link>
            <FaChevronRight size={10} />
            <span>Mi cuenta</span>
            <FaChevronRight size={10} />
            <span className="text-red-600 font-medium">Mis envíos</span>
          </div>

          {shipments.length === 0 ? (
            <div className="text-gray-700 bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
              <p>No tienes envíos registrados aún.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {shipments.map((s) => (
                <ShipmentCard key={s._id} shipment={s} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer bw />
    </div>
  );
}

/* --- Tarjeta individual de envío --- */
function ShipmentCard({ shipment }) {
  const statusMap = {
    processing: { label: "Procesando", color: "text-red-600", value: 25, icon: <FaClock /> },
    shipped: { label: "Enviado", color: "text-blue-600", value: 50, icon: <FaTruck /> },
    in_transit: { label: "En tránsito", color: "text-yellow-600", value: 75, icon: <FaShippingFast /> },
    delivered: { label: "Entregado", color: "text-green-600", value: 100, icon: <FaCheckCircle /> },
  };

  const current = statusMap[shipment.status] || statusMap.processing;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h2 className="font-bold text-gray-800">
            Envío #{shipment._id?.slice(-6) || "—"}
          </h2>
          <p className="text-sm text-gray-500">
            Fecha: {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString("es-ES") : "—"}
          </p>
          <p className="text-sm text-gray-500">
            Transportista:{" "}
            <span className="font-medium">{shipment.carrier || "No especificado"}</span>
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${current.color.replace("text-", "bg-")}/20 ${current.color}`}>
          {current.label}
        </span>
      </div>

      {/* Tracking */}
      <p className="text-sm text-gray-600 mb-4">
        Tracking:{" "}
        {shipment.trackingNumber ? (
          <a
            href={shipment.trackingUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="text-red-600 underline"
          >
            {shipment.trackingNumber}
          </a>
        ) : (
          "No disponible"
        )}
      </p>

      {/* Barra de progreso */}
      <div className="relative w-full bg-gray-200 rounded-full h-2.5 mb-3">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${
            current.value === 100 ? "bg-green-600" : "bg-gradient-to-r from-red-500 to-red-400"
          }`}
          style={{ width: `${current.value}%` }}
        ></div>

        <div className="absolute inset-0 flex justify-between items-center px-1">
          {Object.values(statusMap).map((step) => {
            const active = step.value <= current.value;
            return (
              <div
                key={step.label}
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

      <div className="flex justify-end mt-2">
        <a
          href={shipment.trackingUrl || "#"}
          className="text-sm text-red-600 hover:underline flex items-center gap-1"
        >
          <FaMapMarkerAlt size={13} /> Ver ubicación
        </a>
      </div>
    </div>
  );
}
