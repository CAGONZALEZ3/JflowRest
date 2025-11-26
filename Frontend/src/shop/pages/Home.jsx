import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import CardSellProduct from "../components/CardSellProduct";
import {
  FaTshirt,
  FaShoePrints,
  FaHatCowboy,
  FaGem,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";

function CategoryCard({ icon: Icon, title, description, to = "/Products" }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-50/70 group-hover:bg-red-100 transition" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-red-50 to-red-100 text-red-700 shadow-inner">
          <Icon className="text-xl" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-red-700">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-red-700 group-hover:gap-3 transition">
        Ver productos →
      </span>
    </Link>
  );
}

function Home() {
  const categorias = [
    { title: "Ropa", description: "Moda para cada día", icon: FaTshirt },
    { title: "Zapatillas", description: "Rendimiento y estilo", icon: FaShoePrints },
    { title: "Gorras", description: "Tu sello personal", icon: FaHatCowboy },
    { title: "Accesorios", description: "Detalles que suman", icon: FaGem },
  ];

  const masVendidos = [
    {
      title: "Zapatillas Sport",
      description: "Tecnología avanzada",
      price: "89.99",
      oldPrice: "99.99",
      badge: "Nuevo",
      badgeColor: "bg-green-500",
    },
    {
      title: "Zapatillas Urban",
      description: "Diseño moderno",
      price: "79.99",
      oldPrice: "89.99",
      badge: "-50%",
      badgeColor: "bg-red-500",
    },
    {
      title: "Camiseta Premium",
      description: "Comodidad y estilo",
      price: "29.99",
      oldPrice: "39.99",
      badge: "Popular",
      badgeColor: "bg-yellow-500",
    },
    {
      title: "Gorra Clásica",
      description: "Estilo retro",
      price: "19.99",
      oldPrice: "24.99",
    },
  ];

  return (
    <div className="bg-white text-red-700 font-sans min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-24 pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_100%_-10%,rgba(244,63,94,0.08),transparent),radial-gradient(800px_400px_at_0%_-10%,rgba(244,63,94,0.08),transparent)]"
        />
        <div className="max-w-7xl mx-auto px-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Primera Temporada
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-red-800">
              Viste tu historia con <span className="text-red-600">JFLOWG</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Ropa y accesorios diseñados para destacar. Calidad, estilo y comodidad en un mismo lugar.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/Products"
                className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-800"
              >
                Ver catálogo
              </Link>
              <Link
                to="/Colecction"
                className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition"
              >
                Explorar colección
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl border border-red-100 bg-gradient-to-br from-rose-50 via-white to-rose-100 p-6 shadow-md">
            <div className="aspect-[4/3] w-full rounded-2xl bg-[linear-gradient(135deg,#fff,rgba(244,63,94,0.1))] ring-1 ring-red-100 grid place-items-center text-center">
              <div>
                <p className="text-sm text-red-600 font-semibold">Destacados</p>
                <h3 className="mt-1 text-2xl font-bold text-red-800">-30% en selección</h3>
                <p className="mt-1 text-gray-600 text-sm">Solo por tiempo limitado</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/Products"
                className="rounded-xl bg-white/80 px-4 py-3 text-sm font-semibold text-red-700 border border-red-100 hover:shadow-md transition"
              >
                Mujer
              </Link>
              <Link
                to="/Products"
                className="rounded-xl bg-white/80 px-4 py-3 text-sm font-semibold text-red-700 border border-red-100 hover:shadow-md transition"
              >
                Hombre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="px-6 py-10 bg-gray-50 border-t border-red-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-800">Categorías</h2>
            <p className="mt-1 text-gray-600">
              Encuentra lo que buscas en nuestras categorías principales
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categorias.map((c, i) => (
              <CategoryCard key={i} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* NUEVA COLECCIÓN */}
      <section className="px-6 py-8 bg-white border-t border-red-100">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/Colecction"
            className="block group relative overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-r from-rose-50 via-white to-rose-100 p-8 shadow-sm hover:shadow-md"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-100/70 group-hover:scale-110 transition" />
            <h3 className="relative z-10 text-xl font-bold text-red-800 text-center">
              Nueva Colección
            </h3>
            <p className="relative z-10 mt-1 text-gray-600 text-center">
              Texturas premium y cortes modernos.
            </p>
            <span className="relative z-10 mt-4 inline-block text-sm font-semibold text-red-700 text-center">
              Ver colección →
            </span>
          </Link>
        </div>
      </section>

      {/* MÁS VENDIDOS */}
      <section className="px-6 py-10 bg-gray-50 border-t border-red-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-800">Más vendidos</h2>
            <p className="mt-1 text-gray-600">Los favoritos de nuestros clientes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {masVendidos.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <CardSellProduct {...item} />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/Products"
              className="inline-block rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="px-6 py-10 bg-white border-t border-red-100">
        <div className="max-w-7xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FaTruck, title: "Envío rápido", desc: "48–72 horas a nivel nacional" },
            { icon: FaShieldAlt, title: "Pago seguro", desc: "Protegido con cifrado SSL" },
            { icon: FaUndo, title: "Devoluciones", desc: "7 días para cambios fáciles" },
            { icon: FaHeadset, title: "Soporte 24/7", desc: "Siempre listos para ayudarte" },
          ].map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-red-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-700">
                <b.icon className="text-lg" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-800">{b.title}</h4>
                <p className="text-sm text-gray-600">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
