import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/adminServices';
import AdminLayout from '../components/shared/AdminLayout';

const CreateUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const formatAddress = ({ street, state, postal_code, country }) =>
    [street, state, postal_code, country].filter(Boolean).join(", ");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, address: formatAddress(form.address) };
      await createUser(payload);
      alert("Usuario creado correctamente");
      navigate("/Gestion-User");
    } catch (err) {
      console.error("Error al crear usuario:", err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Crear Usuario</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="border px-3 py-2 rounded" />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Apellido" className="border px-3 py-2 rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Correo" className="col-span-2 border px-3 py-2 rounded" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" type="password" className="col-span-2 border px-3 py-2 rounded" />
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirmar contraseña" type="password" className="col-span-2 border px-3 py-2 rounded"/>
          <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Teléfono" className="col-span-2 border px-3 py-2 rounded" />
          <input name="birth_date" value={form.birth_date} onChange={handleChange} type="date" className="col-span-2 border px-3 py-2 rounded" />
          <input name="gender" value={form.gender} onChange={handleChange} placeholder="Género" className="col-span-2 border px-3 py-2 rounded" />
          <input name="role" value={form.role} onChange={handleChange} type="number" placeholder="Rol" className="col-span-2 border px-3 py-2 rounded" />
        </div>
        <h3 className="text-lg font-semibold mt-6">Dirección</h3>
        <div className="grid grid-cols-2 gap-4">
          <input name="address.country" value={form.address.country} onChange={handleChange} placeholder="País" className="border px-3 py-2 rounded" />
          <input name="address.postal_code" value={form.address.postal_code} onChange={handleChange} placeholder="Código Postal" className="border px-3 py-2 rounded" />
          <input name="address.state" value={form.address.state} onChange={handleChange} placeholder="Provincia" className="border px-3 py-2 rounded" />
          <input name="address.street" value={form.address.street} onChange={handleChange} placeholder="Calle" className="border px-3 py-2 rounded" />
        </div>
          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={() => navigate("/Gestion-User")} className="border px-4 py-2 rounded">
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateUser;