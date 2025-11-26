import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaRedo,
  FaTruck,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

export default function SidebarProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: "Perfil", to: "/Profile", icon: <FaUser size={14} /> },
    { label: "Mis órdenes", to: "/Orders", icon: <FaShoppingBag size={14} /> },
    { label: "Devoluciones", to: "/Returns", icon: <FaRedo size={14} /> },
    { label: "Envíos", to: "/Shipping", icon: <FaTruck size={14} /> },
    { label: "Contraseña", to: "/ChangePassword", icon: <FaLock size={14} /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 
      bg-white/80 backdrop-blur-md border border-red-100 rounded-2xl shadow-md 
      px-4 py-3 mb-10 transition-all duration-300">
      
      {links.map(({ label, to, icon }) => (
        <Link
          key={to}
          to={to}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200
            ${
              isActive(to)
                ? "bg-red-600 text-white shadow-md hover:bg-red-700"
                : "text-gray-700 hover:text-red-600 hover:bg-red-50"
            }`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full 
        text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
      >
        <FaSignOutAlt size={14} />
        <span>Salir</span>
      </button>
    </nav>
  );
}
