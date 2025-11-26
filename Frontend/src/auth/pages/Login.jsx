import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGoogle,
  FaFacebook,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { loginUser } from "../../services/userService";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_SERVER_PORT;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser({ email, password });
    const userData = JSON.stringify(res.user);

    if (rememberMe) {
      localStorage.setItem("user", userData);   
    } else {
      sessionStorage.setItem("user", userData); 
    }

    toast.success("Inicio de sesión exitoso ✅");
    setTimeout(() => {
      window.location.href = res.redirectTo; 
    }, 400);
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      "Error al iniciar sesión ❌";
    toast.error(msg);
  }
};

  const handleSocialAuth = (providerName) => {
    const url = `http://localhost:${PORT}/auth/${providerName}`;
    window.location.href = url;
  };



  return (
    <div className="min-h-screen bg-gradient-to-tr bg-ori from-rose-50 to-white flex flex-col items-center justify-center px-4 py-12 font-bold">
      {/* Logo y Bienvenida */}
      <div className="text-center mb-6">
      <h1 className="text-5xl font-bold text-rose-700 mb-2 cursor-pointer" onClick={()=>{navigate('/Home')}}>JFLOWG</h1>
        <p className="text-gray-600 text-sm mt-1">Bienvenido de nuevo</p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-md border border-rose-200"
      >
        <h2 className="text-xl md:text-2xl mb-4 text-[#374151]">Iniciar Sesión</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa tus credenciales para acceder
        </p>

        {/* Email */}
        <label htmlFor="email" className="block mb-2 text-[#374151] text-sm">
          Email
        </label>
        <div className="flex items-center border rounded mb-4 px-2">
          <FaEnvelope className="text-gray-400" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 text-sm focus:outline-none"
            placeholder="tu@email.com"
          />
        </div>

        {/* Contraseña */}
        <label htmlFor="password" className="block mb-2 text-[#374151] text-sm">
          Contraseña
        </label>
        <div className="flex items-center border rounded mb-4 px-2">
          <FaLock className="text-gray-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-sm focus:outline-none"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 focus:outline-none pr-1"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Recordarme / Olvidé contraseña */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-red-600"
            />
            Recordarme
          </label>
          <Link to="/forgot-password" className="text-red-700 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón Iniciar */}
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition"
        >
          Iniciar Sesión
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-sm text-gray-500">o continúa con</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
            onClick={() => handleSocialAuth('google')}
          >
            <FaGoogle className="text-red-500" />
            Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
            onClick={() => handleSocialAuth('facebook')}
          >
            <FaFacebook className="text-blue-600" />
            Facebook
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-red-700 hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-8">
        © 2024 JFLOWG. Todos los derechos reservados.
      </footer>
    </div>
  );
}
