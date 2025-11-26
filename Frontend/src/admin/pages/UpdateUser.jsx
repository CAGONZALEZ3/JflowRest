import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateUserProfile, deleteUser } from "../services/adminServices";
import AdminLayout from "../components/shared/AdminLayout";

const UserEditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("general");

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    address: {
      country: "",
      postal_code: "",
      state: "",
      street: ""
    },
    role: 200
  });

  useEffect(() => {
    if (location.state && location.state.user) {
      const user = location.state.user;
      setForm({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "", 
        phone_number: user.phone_number || "",
        birth_date: user.birth_date?.substring(0, 10) || "",
        gender: user.gender || "",
        address: {
          country: user.address?.country || "",
          postal_code: user.address?.postal_code || "",
          state: user.address?.state || "",
          street: user.address?.street || ""
        },
        role: user.role || 200
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const formatAddress = ({ street = "", state = "", postal_code = "", country = "" }) => {
    return [street, state, postal_code, country].filter(Boolean).join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = location.state?.user?._id || location.state?.user?.id;
      if (!id) throw new Error("ID de usuario no encontrado");

      const formattedAddress = formatAddress(form.address);
      const payload = { ...form, address: formattedAddress };

      await updateUserProfile(id, payload);
      alert("Usuario actualizado correctamente");
      navigate("/Gestion-User");
    } catch (err) {
      console.error("Error al actualizar usuario:", err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const id = location.state?.user?._id || location.state?.user?.id;
      await deleteUser(id);
      alert("Usuario eliminado");
      navigate("/Gestion-User");
    } catch (err) {
      alert(err.message || "Error al eliminar usuario");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-1 text-indigo-600">Panel de Administración</h2>
        <p className="text-center mb-6 text-gray-500">Editar información del usuario</p>

        <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 space-y-4">
        <h3 className="font-semibold text-lg mb-2">Información del Usuario</h3>

        <div className="flex gap-2 border-b">
          {["general", "direccion"].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 font-medium ${
                activeTab === tab ? "border-red-500 text-red-500" : "border-transparent text-gray-500"
              }`}
            >
              {tab === "general" ? "Datos Generales" : "Dirección"}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="w-1/2 border px-3 py-2 rounded" />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Apellido" className="w-1/2 border px-3 py-2 rounded" />
            </div>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Correo" className="w-full border px-3 py-2 rounded" />
            <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Teléfono" className="w-full border px-3 py-2 rounded" />
            <input name="birth_date" value={form.birth_date} onChange={handleChange} type="date" className="w-full border px-3 py-2 rounded" />
            <input name="gender" value={form.gender} onChange={handleChange} placeholder="Género" className="w-full border px-3 py-2 rounded" />
            <input name="role" value={form.role} onChange={handleChange} placeholder="Rol" type="number" className="w-full border px-3 py-2 rounded" />
          </div>
        )}

        {activeTab === "direccion" && (
          <div className="grid grid-cols-2 gap-4">
            <input name="address.country" value={form.address.country} onChange={handleChange} placeholder="País" className="border px-3 py-2 rounded" />
            <input name="address.postal_code" value={form.address.postal_code} onChange={handleChange} placeholder="Código Postal" className="border px-3 py-2 rounded" />
            <input name="address.state" value={form.address.state} onChange={handleChange} placeholder="Provincia" className="border px-3 py-2 rounded" />
            <input name="address.street" value={form.address.street} onChange={handleChange} placeholder="Calle" className="border px-3 py-2 rounded" />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={() => navigate("/Gestion-User")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Guardar Usuario
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Eliminar Usuario
          </button>
        </div>
      </form>
      </div>
    </AdminLayout>
  );
};

export default UserEditForm;