import { useEffect, useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";

export default function AdminTopbar({ onToggleSidebar }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="h-14 px-4 md:px-6 flex items-center gap-3">
        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={() => onToggleSidebar?.()}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>

        {/* Buscador */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition"
            />
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notificaciones */}
          <button className="relative w-9 h-9 inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 transition">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center">
              3
            </span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden md:block" />

          {/* Perfil */}
          <button className="group flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 hover:bg-red-50 transition">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-400 text-white flex items-center justify-center text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[11px] leading-4 text-slate-500">Admin</p>
              <p className="text-sm font-medium text-slate-800 line-clamp-1">
                {user ? `${user.name} ${user.lastName || ""}` : "Usuario"}
              </p>
            </div>
            <ChevronDown size={15} className="text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
