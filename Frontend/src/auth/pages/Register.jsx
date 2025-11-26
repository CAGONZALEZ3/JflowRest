import { useState } from "react";
import { registerUser } from "../../services/userService";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);
      sessionStorage.setItem("user", JSON.stringify(res.user));

      toast.success("Cuenta creada correctamente 🎉");
      setTimeout(() => {
        window.location.href = res.redirectTo; // o navigate(res.redirectTo)
      }, 400);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Error al registrarse";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-100 to-white flex flex-col items-center justify-center px-4 py-10">
      <h1
        className="text-5xl font-bold text-rose-700 mb-2 cursor-pointer"
        onClick={() => {
          navigate("/Home");
        }}
      >
        JFLOWG
      </h1>
      <p className="text-sm text-gray-600 mb-6">Crea tu cuenta nueva</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-3xl shadow-lg space-y-5 border border-rose-200"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Crear Cuenta</h2>
        <p className="text-sm text-gray-500">Completa tus datos para registrarte</p>

        {/* Nombre y Apellido */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label className="text-sm text-gray-600 block mb-1">Nombre</label>
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-rose-300">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full text-sm focus:outline-none"
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <label className="text-sm text-gray-600 block mb-1">Apellido</label>
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-rose-300">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full text-sm focus:outline-none"
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Email</label>
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-rose-300">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Contraseña</label>
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-rose-300">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Confirmar Contraseña</label>
          <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-rose-300">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full text-sm focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Términos */}
        <div className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            className="accent-rose-600 mt-1"
            required
          />
          <span>
            Acepto los
            <a href="#" className="text-rose-600 hover:underline ml-1">
              términos y condiciones
            </a>
          </span>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-rose-700 text-white py-2.5 rounded-md hover:bg-rose-800 transition-all"
        >
          Crear Cuenta
        </button>

        <div className="text-center text-sm text-gray-600">O regístrate con</div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500" /> Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
          >
            <FaFacebook className="text-blue-600" /> Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-rose-600 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </form>

      <footer className="text-center text-xs text-gray-500 mt-8">
        © 2024 JFLOWG. Todos los derechos reservados.
      </footer>
    </div>
  );
}
