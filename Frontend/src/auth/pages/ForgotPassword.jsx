import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enlace de recuperación enviado a:", email);
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-6 font-orbitron">
      {/* Logo y encabezado */}
      <div className="text-center mb-4">
        <h1 className="text-4xl text-red-700 mb-1">JFLOWG</h1>
        <p className="text-sm text-gray-600">Recupera tu contraseña</p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4 border border-rose-200"
      >
        <div>
          <h2 className="text-lg text-[#374151] mb-1">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="text-xs text-gray-500">
            Te enviaremos un enlace para restablecerla.
          </p>
        </div>

        {/* Campo de correo */}
        <div>
          <label htmlFor="email" className="block mb-1 text-[#374151] text-sm">
            Email
          </label>
          <div className="flex items-center border rounded px-2">
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
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition text-sm"
        >
          Enviar Enlace
        </button>

        {/* Enlace para volver */}
        <div className="text-center">
          <Link
            to="/Login"
            className="flex items-center justify-center text-sm text-red-600 hover:underline gap-1"
          >
            <FaArrowLeft className="text-xs" />
            Volver al inicio de sesión
          </Link>
        </div>
      </form>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-6">
        © 2024 JFLOWG. Todos los derechos reservados.
      </footer>
    </div>
  );
}
