import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import UserSidebar from "../../shared/components/UserSidebar";
import { updateUserProfile, getUserProfile } from "../../services/userService";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone_number: "",
    birth_date: "",
    gender: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const stored = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (!stored) {
        alert("No hay sesión iniciada.");
        navigate("/Login");
        return;
      }
      const res = await getUserProfile();
      setUser(res);
      setFormData({
        name: res.name || "",
        lastName: res.lastName || "",
        phone_number: res.phone_number || "",
        birth_date: res.birth_date ? res.birth_date.slice(0, 10) : "",
        gender: res.gender || "",
      });
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateUserProfile(formData);
      const userStr = JSON.stringify(res.user);
      sessionStorage.setItem("user", userStr);
      localStorage.setItem("user", userStr);
      navigate(res.redirectTo || "/Profile");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Cargando perfil…</p>
      </div>
    );
  }

  const initials = `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar bw />

      <main className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-24 gap-8">
        {/* Sidebar de usuario */}
        <UserSidebar user={user} />

        {/* Sección principal */}
        <section className="flex-1 bg-white border border-red-100 rounded-3xl shadow-xl p-8">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-red-600 mb-2">
                Editar perfil
              </h1>
              <p className="text-gray-500 text-base">
                Actualiza tu información personal.
              </p>
            </div>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-white border border-red-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Línea superior */}
            <div className="h-1 w-full bg-red-600" />

            <div className="p-6 md:p-8">
              {/* Perfil compacto */}
              <div className="flex items-center gap-4 md:gap-6 mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 text-white flex items-center justify-center text-xl md:text-2xl font-bold shadow-md">
                  {initials}
                </div>
                <div>
                  <div className="text-lg md:text-xl font-semibold text-gray-900">
                    {user.name} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    id="name"
                    label="Nombre"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <FormInput
                    id="lastName"
                    label="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <FormInput
                    id="phone_number"
                    label="Teléfono"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+507 6000-0000"
                  />
                  <FormInput
                    id="birth_date"
                    label="Fecha de nacimiento"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleChange}
                  />
                  <FormSelect
                    id="gender"
                    label="Género"
                    value={formData.gender}
                    onChange={handleChange}
                  />
                </div>

                {/* Botones */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/Profile")}
                    className="inline-flex items-center justify-center rounded-lg border border-red-400 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 shadow-sm"
                  >
                    {saving ? "Guardando…" : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer bw />
    </div>
  );
}

/* 🔹 Input reutilizable */
function FormInput({ id, label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>
  );
}

/* 🔹 Select reutilizable */
function FormSelect({ id, label, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="">Seleccionar</option>
        <option value="male">Masculino</option>
        <option value="female">Femenino</option>
        <option value="other">Otro</option>
      </select>
    </div>
  );
}
