import React, { useEffect, useState } from "react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import SidebarProfile from "../../shared/components/SidebarProfile";

export default function ChangePassword() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  useEffect(() => {
    const stored =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }
    // Aquí puedes integrar tu API para cambiar la contraseña
    alert("Contraseña actualizada correctamente ✅");
    setForm({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-red-50/40">
      <Navbar bw />

      <main className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 py-20">
        {/* Encabezado superior */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Cambiar contraseña
            </h2>
            <p className="text-sm text-gray-500">
              Actualiza tu contraseña para mantener la seguridad de tu cuenta.
            </p>
          </div>
        </div>

        {/* Barra horizontal de navegación */}
        <SidebarProfile />

        {/* Contenido principal */}
        <section className="flex-1 bg-white/80 backdrop-blur-md border border-red-100 rounded-3xl shadow-xl p-10 relative overflow-hidden">
          <h1 className="text-3xl font-extrabold text-red-600 mb-4">
            Cambiar contraseña
          </h1>
          <p className="text-gray-500 mb-10">
            Por tu seguridad, asegúrate de crear una contraseña única y segura.
          </p>

          <form
            onSubmit={handleSubmit}
            className="max-w-md flex flex-col gap-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contraseña actual
              </label>
              <input
                type="password"
                name="current"
                value={form.current}
                onChange={handleChange}
                className="w-full border border-red-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="newPass"
                value={form.newPass}
                onChange={handleChange}
                className="w-full border border-red-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className="w-full border border-red-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              Guardar cambios
            </button>
          </form>
        </section>
      </main>

      <Footer bw />
    </div>
  );
}
