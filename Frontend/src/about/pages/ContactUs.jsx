import React, { useState } from "react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));3



    
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Ingresa tu nombre.";
    if (!form.email.trim()) {
      er.email = "Ingresa tu correo.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      er.email = "Correo no válido.";
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      er.message = "Cuéntanos un poco más (mín. 10 caracteres).";
    }
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSending(true);
      await new Promise((r) => setTimeout(r, 900)); // demo
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setErrors({ form: "No se pudo enviar. Inténtalo nuevamente." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white text-red-800 min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_420px_at_100%_-10%,rgba(244,63,94,0.08),transparent),radial-gradient(900px_320px_at_0%_-10%,rgba(244,63,94,0.08),transparent)]"
        />
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-10 text-center">
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            ¿Hablemos?
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Envíanos un mensaje
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Responderemos lo antes posible. Tu opinión nos ayuda a mejorar.
          </p>
        </div>
      </section>
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-5">
       
          <div className="space-y-4 lg:col-span-2">
            {[
              {
                icon: FaEnvelope,
                title: "Correo",
                text: "soporte@jflowg.com",
                hint: "Escríbenos 24/7",
              },
              {
                icon: FaPhoneAlt,
                title: "Teléfono",
                text: "+507 6000-0000",
                hint: "Lun a Vie, 9:00–18:00",
              },
              {
                icon: FaMapMarkerAlt,
                title: "Ubicación",
                text: "Ciudad de Panamá, Panamá",
                hint: "Atención con cita",
              },
              {
                icon: FaClock,
                title: "Horarios",
                text: "48–72h para responder",
                hint: "¡Siempre leemos todo!",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-700 flex-shrink-0">
                  <c.icon className="text-lg" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-700">{c.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.hint}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm"
            >
              {errors.form && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {errors.form}
                </div>
              )}
              {sent && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                  ¡Gracias! Tu mensaje fue enviado correctamente.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-semibold text-red-800"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-300 focus:ring-red-400"
                        : "border-red-200 focus:ring-red-500/50"
                    }`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-semibold text-red-800"
                  >
                    Correo
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-300 focus:ring-red-400"
                        : "border-red-200 focus:ring-red-500/50"
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="message"
                  className="mb-1 block text-sm font-semibold text-red-800"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Cuéntanos en qué podemos ayudarte…"
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                    errors.message
                      ? "border-red-300 focus:ring-red-400"
                      : "border-red-200 focus:ring-red-500/50"
                  }`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-red-600">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Enviar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
