import React from "react";
import { LogIn, LogOut, UserPlus, User, Activity } from "lucide-react";

export default function RecentActivity({ recent }) {
  const getIcon = (action) => {
    if (action.includes("logged_in"))
      return <LogIn className="w-4 h-4 text-green-500" />;
    if (action.includes("logged_out"))
      return <LogOut className="w-4 h-4 text-red-500" />;
    if (action.includes("registered"))
      return <UserPlus className="w-4 h-4 text-blue-500" />;
    if (action.includes("profile_updated"))
      return <User className="w-4 h-4 text-yellow-500" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const CATEGORIES = {
    Usuarios: ["user_logged_in", "user_logged_out", "user_registered", "profile_updated"],
    Pedidos: ["order_created", "order_updated", "order_cancelled"],
    Devoluciones: ["return_requested", "return_approved", "return_rejected"],
    Productos: ["product_created", "product_updated", "product_deleted"],
  };

  const categoryColors = {
    Usuarios: "text-blue-600",
    Pedidos: "text-indigo-600",
    Devoluciones: "text-rose-600",
    Productos: "text-emerald-600",
  };

  const grouped = Object.entries(CATEGORIES).map(([category, actions]) => ({
    category,
    items: recent.filter((e) =>
      actions.some((a) => e.action?.toLowerCase().includes(a.toLowerCase()))
    ),
  }));

  return (
    <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-red-600" /> Actividad Reciente
      </h3>

      {recent.length === 0 ? (
        <div className="text-sm text-gray-500">No hay actividad reciente.</div>
      ) : (
        grouped.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.category} className="mb-6">
                <h4
                  className={`text-sm font-semibold ${categoryColors[group.category]} mb-3 border-b pb-1`}
                >
                  {group.category}
                </h4>
                <ul className="divide-y divide-slate-100">
                  {group.items.map((e) => (
                    <li
                      key={e._id}
                      className="py-3 flex items-center justify-between text-sm hover:bg-slate-50 rounded-lg px-2 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 truncate pr-3">
                        <div className="p-2 bg-slate-100 rounded-full">
                          {getIcon(e.action)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">
                            {e.action.replaceAll("_", " ")}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {e.actor_name ||
                              e.actor_email ||
                              `ID: #${String(e.entity_id).slice(-6)}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-500 text-xs font-medium whitespace-nowrap">
                        {formatDate(e.occurred_at || e.createdAt)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
        )
      )}
    </div>
  );
}
