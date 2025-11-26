import React from "react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import {
  FaCheckCircle,
  FaLeaf,
  FaUsers,
  FaHandshake,
  FaTshirt,
  FaShippingFast,
} from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="bg-white text-red-800 min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_420px_at_100%_-10%,rgba(244,63,94,0.08),transparent),radial-gradient(900px_320px_at_0%_-10%,rgba(244,63,94,0.08),transparent)]"
        />
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 text-center">
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            Sobre nosotros
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Conócenos
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            En JFLOWG creemos que la moda es expresión. Creamos prendas modernas,
            cómodas y accesibles para acompañarte todos los días.
          </p>
        </div>
      </section>

      {/* VALORES */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: FaCheckCircle,
              title: "Calidad real",
              desc:
                "Diseños cuidados, materiales seleccionados y acabados que duran.",
            },
            {
              icon: FaLeaf,
              title: "Responsables",
              desc:
                "Optimizamos procesos para reducir desperdicios y priorizamos proveedores conscientes.",
            },
            {
              icon: FaUsers,
              title: "Comunidad",
              desc:
                "Escuchamos a nuestros clientes y co-creamos productos que de verdad usan.",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-700">
                  <v.icon className="text-lg" />
                </div>
                <h3 className="text-lg font-semibold">{v.title}</h3>
              </div>
              <p className="mt-3 text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Nuestra historia</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Un camino que empezó con una idea simple: ropa honesta, bonita y
              sin complicaciones.
            </p>
          </div>

          <ol className="relative border-s-2 border-red-100">
            {[
              {
                year: "2022",
                title: "El inicio",
                text:
                  "Lanzamos nuestra primera línea con un pequeño catálogo y muchas ganas.",
              },
              {
                year: "2023",
                title: "Crecimiento",
                text:
                  "Ampliamos categorías y optimizamos procesos para mejorar tiempos de entrega.",
              },
              {
                year: "2024",
                title: "Comunidad",
                text:
                  "Creamos colecciones con feedback directo de clientes y colaboradores.",
              },
            ].map((step, i) => (
              <li key={i} className="mb-8 ms-4">
                <span className="absolute -start-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 ring-8 ring-red-50" />
                <time className="mb-1 block text-xs font-semibold text-red-600">
                  {step.year}
                </time>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-rose-50 via-white to-rose-100 p-6">
            <h3 className="text-xl font-bold text-red-800">Nuestra misión</h3>
            <p className="mt-2 text-gray-600">
              Hacer fácil vestirse bien: piezas versátiles, cómodas y con
              personalidad, sin sacrificar el bolsillo.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/70 border border-red-100 p-4">
                <FaTshirt className="text-red-700" />
                <p className="mt-1 text-sm text-gray-700">
                  Prendas pensadas para usar mucho.
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 border border-red-100 p-4">
                <FaShippingFast className="text-red-700" />
                <p className="mt-1 text-sm text-gray-700">
                  Envíos ágiles y trazables.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-100 bg-white p-6">
            <h3 className="text-xl font-bold text-red-800">Nuestra visión</h3>
            <p className="mt-2 text-gray-600">
              Ser una marca cercana que crece con su comunidad, elevando el
              estándar de lo “básico” en la región.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-700">
                <FaHandshake className="text-lg" />
              </div>
              <p className="text-sm text-gray-700">
                Transparencia, colaboración y mejora continua.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto rounded-3xl border border-red-100 bg-white p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Clientes felices", value: "5K+" },
              { label: "Referencias", value: "250+" },
              { label: "Tiempo de envío", value: "48–72h" },
              { label: "Satisfacción", value: "4.8/5" },
            ].map((stat, i) => (
              <div key={i} className="px-2">
                <div className="text-2xl font-extrabold text-red-700">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto text-center overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-rose-50 via-white to-rose-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-red-800">
            ¿Listo para conocernos aún más?
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Explora el catálogo o escríbenos: estamos para ayudarte.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href="/Products"
              className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-800"
            >
              Ver productos
            </a>
            <a
              href="/Contact"
              className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition"
            >
              Contacto
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
