import React from "react";

export default function DashboardStats({ totals }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {[
        {
          label: "Total Productos",
          value: totals.products,
          sub: "En catálogo",
        },
        {
          label: "Pedidos Activos",
          value: totals.activeOrders,
          sub: "En preparación o envío",
        },
        {
          label: "Devoluciones",
          value: totals.returns,
          sub: "Últimos 14 días",
        },
        {
          label: "Usuarios",
          value: totals.users,
          sub: "Registrados",
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm"
        >
          <p className="text-xs font-medium text-gray-500">{item.label}</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-800">
            {item.value}
          </h2>
          <p className="text-[11px] text-gray-400 mt-1">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
