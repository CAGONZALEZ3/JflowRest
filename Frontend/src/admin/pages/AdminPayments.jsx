// src/admin/pages/AdminPayments.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/shared/AdminLayout";
import { DollarSign, Clock, RefreshCcw, Calendar } from "lucide-react";
import { getPaymentsSummary } from "../services/adminServices";

export default function AdminPayments() {
  const [summary, setSummary] = useState({
    totalReceived: 0,
    pending: 0,
    refunded: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    // 🔹 Llamada real a la API
    const fetchPaymentsSummary = async () => {
      try {
        const data = await getPaymentsSummary();
        if (data.success) {
          setSummary({
            totalReceived: data.totalReceived || 0,
            pending: data.pending || 0,
            refunded: data.refunded || 0,
            thisMonth: data.thisMonth || 0,
          });
        } else {
          console.error("Error al obtener resumen de pagos:", data.error);
        }
      } catch (err) {
        console.error("Error al conectar con el backend:", err);
      }
    };
    fetchPaymentsSummary();
  }, []);

  const formatCurrency = (n) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-extrabold text-red-600 mb-6">
          Resumen general de pagos
        </h1>

        {/* --- Tarjetas de indicadores --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {/* Total recibido */}
          <div className="flex items-center justify-between bg-white border border-red-100 rounded-3xl shadow-md p-6 hover:shadow-lg transition">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total recibido</p>
              <h2 className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(summary.totalReceived)}
              </h2>
            </div>
            <DollarSign className="text-green-600 w-8 h-8" />
          </div>

          {/* Pagos pendientes */}
          <div className="flex items-center justify-between bg-white border border-red-100 rounded-3xl shadow-md p-6 hover:shadow-lg transition">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pagos pendientes</p>
              <h2 className="text-2xl font-bold text-yellow-600 mt-1">
                {summary.pending}
              </h2>
            </div>
            <Clock className="text-yellow-600 w-8 h-8" />
          </div>

          {/* Reembolsos realizados */}
          <div className="flex items-center justify-between bg-white border border-red-100 rounded-3xl shadow-md p-6 hover:shadow-lg transition">
            <div>
              <p className="text-gray-500 text-sm font-medium">Reembolsos realizados</p>
              <h2 className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(summary.refunded)}
              </h2>
            </div>
            <RefreshCcw className="text-red-600 w-8 h-8" />
          </div>

          {/* Ingresos del mes */}
          <div className="flex items-center justify-between bg-white border border-red-100 rounded-3xl shadow-md p-6 hover:shadow-lg transition">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Ingresos del mes actual
              </p>
              <h2 className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(summary.thisMonth)}
              </h2>
            </div>
            <Calendar className="text-blue-600 w-8 h-8" />
          </div>
        </div>

        {/* Puedes seguir con tabla de pagos o gráfico */}
        <p className="text-gray-500">
          Aquí podrás visualizar tus métricas financieras en tiempo real y
          próximamente el historial detallado de transacciones.
        </p>
      </div>
    </AdminLayout>
  );
}
