import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaRedo,
  FaTruck,
  FaLock,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function UserSidebar({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const initials = `${user?.name?.[0] ?? "U"}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  const links = [
    { label: "Perfil", to: "/Profile", icon: <FaUser size={15} /> },
    { label: "Mis órdenes", to: "/Orders", icon: <FaShoppingBag size={15} /> },
    { label: "Devoluciones", to: "/Returns", icon: <FaRedo size={15} /> },
    { label: "Envíos", to: "/Shipping", icon: <FaTruck size={15} /> },
    { label: "Cambiar contraseña", to: "/ChangePassword", icon: <FaLock size={15} /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🔹 Link activo igual que en Navbar
  const ActiveLink = ({ to, children }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors 
          ${
            active
              ? "text-red-700 bg-red-50 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600 after:scale-x-100"
              : "text-gray-700 hover:text-red-700 hover:bg-gray-100 after:scale-x-0"
          }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Botón móvil */}
      <button
        className="md:hidden fixed top-24 left-4 z-40 bg-red-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(true)}
      >
        <FaBars size={18} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 h-full md:h-auto w-[80%] max-w-xs md:w-64 bg-white border-r border-red-100 shadow-lg md:shadow-none p-6 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header móvil */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-lg font-bold text-red-600 tracking-tight">Mi cuenta</h2>
          <button
            className="md:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Info del usuario */}
        <div className="flex items-center gap-3 mb-8 border-b border-red-100 pb-4">
          <div className="bg-red-600 text-white font-semibold text-lg w-10 h-10 rounded-full flex items-center justify-center shadow">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-800 truncate">
              {user?.name} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Menú */}
        <ul className="space-y-2">
          {links.map((link, i) => (
            <li key={i}>
              <ActiveLink to={link.to}>
                {link.icon}
                {link.label}
              </ActiveLink>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg w-full transition"
            >
              <FaSignOutAlt size={15} />
              Cerrar sesión
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}
