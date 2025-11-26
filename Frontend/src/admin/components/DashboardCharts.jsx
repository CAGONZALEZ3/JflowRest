import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardCharts({ overview }) {
  const salesData = overview?.revenueSeries || [];
  const signupsData = overview?.signupsSeries || [];
  const orders = overview?.ordersByStatus || {};

  const salesChart = {
    labels: salesData.map((s) =>
      new Date(s._id).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Ventas ($)",
        data: salesData.map((s) => (s.revenue ?? 0) / 100),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const usersChart = {
    labels: signupsData.map((u) =>
      new Date(u._id).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Nuevos usuarios",
        data: signupsData.map((u) => u.signups),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const ordersChart = {
    labels: ["Completadas", "Pendientes", "Canceladas"],
    datasets: [
      {
        data: [
          orders.succeeded ?? 0,
          orders.processing ?? 0,
          orders.failed ?? 0,
        ],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-red-100 p-6 shadow">
          <h3 className="text-base font-semibold text-slate-800 mb-4">
            Ventas (últimos 14 días)
          </h3>
          <div className="h-64">
            <Line data={salesChart} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow">
          <h3 className="text-base font-semibold text-slate-800 mb-4">
            Órdenes por estado
          </h3>
          <div className="h-52 flex items-center justify-center">
            <Doughnut data={ordersChart} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-red-100 p-6 mb-6 shadow">
        <h3 className="text-base font-semibold text-slate-800 mb-4">
          Nuevos usuarios (últimos 14 días)
        </h3>
        <div className="h-64">
          <Line data={usersChart} />
        </div>
      </div>
    </>
  );
}
