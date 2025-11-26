import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RotateCcw,
  Users,
  LogOut,
  Settings,
  CreditCard,
  HelpCircle,
} from "lucide-react";

export default function AdminSidebar({ className = "" }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/Login");
  };

  const mainMenu = [
    { label: "Dashboard", to: "/Dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Pedidos", to: "/Gestion-Pedidos", icon: <ShoppingCart size={18} /> },
    { label: "Productos", to: "/Product-Crud", icon: <Package size={18} /> },
    { label: "Devoluciones", to: "/Gestion-Devolution", icon: <RotateCcw size={18} /> },
  ];

  const otherMenu = [
    { label: "Usuarios", to: "/Gestion-User", icon: <Users size={18} /> },
    { label: "Pagos", to: "/Admin-Payments", icon: <CreditCard size={18} /> },
    { label: "Ajustes", to: "/Dashboard", icon: <Settings size={18} /> },
    { label: "Ayuda", to: "/Dashboard", icon: <HelpCircle size={18} /> },
  ];

  const Item = ({ to, label, icon }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={
          "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition border " +
          (active
            ? "bg-red-50 text-red-600 border-red-100"
            : "text-slate-600 hover:bg-red-50/50 hover:text-red-600 border-transparent")
        }
      >
        <span
          className={
            "inline-flex items-center justify-center w-8 h-8 rounded-lg border transition " +
            (active
              ? "bg-white text-red-500 border-red-200"
              : "bg-white text-slate-500 border-slate-200 group-hover:text-red-500 group-hover:border-red-200")
          }
        >
          {icon}
        </span>
        {label}
      </Link>
    );
  };

  return (
    <aside
      className={(
        "hidden md:flex w-60 shrink-0 bg-white border-r border-slate-200 min-h-screen sticky top-0 " +
        className
      ).trim()}
    >
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="px-5 pt-6 pb-3">
          <p className="text-lg font-bold text-red-600 tracking-tight">
            Panel de gestión
          </p>
        </div>

        {/* Menú principal */}
        <div className="px-3 py-2">
          <p className="px-2 mb-1 text-[10px] font-semibold tracking-wider text-slate-400">
            MENÚ
          </p>
          <nav className="space-y-1.5">
            {mainMenu.map((it) => (
              <Item key={it.to} {...it} />
            ))}
          </nav>
        </div>

        {/* Otros */}
        <div className="px-3 py-3 mt-2 border-t border-slate-200">
          <p className="px-2 mb-1 text-[10px] font-semibold tracking-wider text-slate-400">
            OTROS
          </p>
          <nav className="space-y-1.5">
            {otherMenu.map((it) => (
              <Item key={it.to + it.label} {...it} />
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3 py-2 rounded-lg text-sm transition"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
