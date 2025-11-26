import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import SidebarProfile from "../../shared/components/SidebarProfile";
import {
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
  FaClipboardCheck,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Returns() {
  const [user, setUser] = useState(null);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const PORT = import.meta.env.VITE_SERVER_PORT;

  useEffect(() => {
    const stored =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) fetchReturns();
  }, [user]);

  const fetchReturns = async () => {
    try {
      const res = await axios.get(`http://localhost:${PORT}/api/v1/orders/user`, {
        withCredentials: true,
      });
      const filtered = res.data.orders.filter(
        (o) => o.return && o.return.status !== "none"
      );
      setReturns(filtered);
    } catch (err) {
      console.error("Error obteniendo devoluciones:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Cargando tus devoluciones…</p>
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
              Mis devoluciones
            </h2>
            <p className="text-sm text-gray-500">
              Consulta el estado y los detalles de tus devoluciones.
            </p>
          </div>
        </div>

        {/* Barra horizontal de navegación */}
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
            <span className="text-red-600 font-medium">Mis devoluciones</span>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <MetricCard
              icon={<FaClock className="text-yellow-600 text-xl" />}
              label="Pendientes"
              value={returns.filter((r) => r.return?.status === "requested").length}
              bg="from-yellow-50 to-white"
              color="text-yellow-600"
            />
            <MetricCard
              icon={<FaCheckCircle className="text-green-600 text-xl" />}
              label="Aprobadas"
              value={returns.filter((r) => r.return?.status === "approved").length}
              bg="from-green-50 to-white"
              color="text-green-600"
            />
            <MetricCard
              icon={<FaTimesCircle className="text-red-600 text-xl" />}
              label="Rechazadas"
              value={returns.filter((r) => r.return?.status === "rejected").length}
              bg="from-red-50 to-white"
              color="text-red-600"
            />
          </div>

          {/* Lista de devoluciones */}
          {returns.length === 0 ? (
            <div className="text-gray-700 bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
              <p>No tienes devoluciones activas en este momento.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {returns.map((order) => (
                <ReturnCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer bw />
    </div>
  );
}

/* --- Tarjeta de devolución individual --- */
function ReturnCard({ order }) {
  const status = order.return?.status;
  const reason = order.return?.reason || "Sin motivo especificado";
  const date =
    order.return?.requestedAt &&
    new Date(order.return.requestedAt).toLocaleDateString("es-ES");

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="font-bold text-gray-800">
            Devolución #{order._id.slice(-6)}
          </h2>
          <p className="text-sm text-gray-500">
            Fecha solicitud: {date || "—"}
          </p>
        </div>
        <ReturnStatus status={status} />
      </div>

      {/* Motivo */}
      <p className="text-gray-600 text-sm mb-4">
        <span className="font-semibold text-gray-700">Motivo:</span> {reason}
      </p>

      {/* Progreso visual */}
      <ReturnProgress status={status} />

      {/* Respuesta */}
      <div className="mt-3 text-sm text-gray-500">
        <span className="font-medium">Respuesta:</span>{" "}
        {order.return?.responseMessage || "Sin respuesta aún"}
      </div>
    </div>
  );
}

/* --- Estado visual --- */
function ReturnStatus({ status }) {
  const map = {
    approved: { text: "Aprobada", class: "bg-green-100 text-green-700" },
    requested: { text: "Pendiente", class: "bg-yellow-100 text-yellow-700" },
    rejected: { text: "Rechazada", class: "bg-red-100 text-red-700" },
  };
  const s = map[status] || { text: "En revisión", class: "bg-gray-100 text-gray-600" };
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.class}`}
    >
      {s.text}
    </span>
  );
}

/* --- Progreso visual --- */
function ReturnProgress({ status }) {
  const progressMap = {
    requested: { value: 25, label: "Solicitada", icon: <FaUndo /> },
    reviewing: { value: 50, label: "En revisión", icon: <FaClipboardCheck /> },
    approved: { value: 100, label: "Aprobada", icon: <FaCheckCircle /> },
    rejected: { value: 100, label: "Rechazada", icon: <FaExclamationCircle /> },
  };

  const current = progressMap[status] || progressMap.reviewing;
  const color =
    status === "approved"
      ? "bg-green-600"
      : status === "rejected"
      ? "bg-red-600"
      : "bg-yellow-500";

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Solicitada</span>
        <span>En revisión</span>
        <span>{status === "rejected" ? "Rechazada" : "Aprobada"}</span>
      </div>

      {/* Barra de progreso */}
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
        <span>Estado devolución:</span>
        <span
          className={`font-semibold capitalize ${
            status === "approved"
              ? "text-green-600"
              : status === "rejected"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {current.label}
        </span>
      </div>
    </div>
  );
}

/* --- Métricas --- */
function MetricCard({ icon, label, value, bg, color }) {
  return (
    <div
      className={`p-5 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br ${bg} flex flex-col items-center justify-center hover:shadow-md transition-all duration-200`}
    >
      {icon}
      <p className="text-sm text-gray-500 mt-2">{label}</p>
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}
