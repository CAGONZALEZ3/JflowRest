import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { Pencil } from "lucide-react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import { getUserProfile } from "../../services/userService";
import SidebarProfile from "../../shared/components/SidebarProfile";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const stored =
        sessionStorage.getItem("user") || localStorage.getItem("user");
      if (!stored) {
        navigate("/Login");
        return;
      }
      const res = await getUserProfile();
      setUser(res);
    };
    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Cargando perfil…</p>
      </div>
    );
  }

  const initials = `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-red-50/40">
      <Navbar bw />

      <main className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 py-20">
        {/* Encabezado superior */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Mi perfil
            </h2>
            <p className="text-sm text-gray-500">
              Gestiona la información de tu cuenta y mantén tus datos actualizados.
            </p>
          </div>
          <button
            onClick={() => navigate("/Edit-Profile")}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition shadow-md hover:shadow-lg"
          >
            <Pencil size={16} />
            Editar perfil
          </button>
        </div>

        {/* Barra horizontal de navegación */}
        <SidebarProfile/>

        {/* Contenedor principal */}
        <section className="bg-white/80 backdrop-blur-lg border border-red-100 rounded-3xl shadow-xl p-10 relative overflow-hidden">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 gap-1 mb-6">
            <Link to="/" className="hover:text-red-600 transition">Inicio</Link>
            <FaChevronRight size={10} />
            <span>Mi cuenta</span>
            <FaChevronRight size={10} />
            <span className="text-red-600 font-medium">Perfil</span>
          </div>

          {/* Avatar y nombre */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-600 to-red-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name} {user.lastName}
              </h2>
              <p className="text-gray-500 text-base">{user.email}</p>
            </div>
          </div>

          {/* Información personal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Información personal
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Datos básicos de tu cuenta.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem label="Nombre" value={user.name} />
              <InfoItem label="Apellido" value={user.lastName} />
              <InfoItem label="Correo electrónico" value={user.email} />
              <InfoItem
                label="Teléfono"
                value={user.phone_number || "No especificado"}
              />
              <InfoItem
                label="Fecha de nacimiento"
                value={user.birth_date?.slice(0, 10) || "No especificada"}
              />
              <InfoItem label="Género" value={user.gender || "No especificado"} />
            </div>
          </div>
        </section>
      </main>

      <Footer bw />
    </div>
  );
}

/* Subcomponente para mostrar cada dato */
function InfoItem({ label, value }) {
  return (
    <div className="border border-red-100 bg-white rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-gray-800 text-base font-medium">{value}</p>
    </div>
  );
}
