import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import CardProduct from "../components/CardProduct";

function Colecction() {
  // Data mock (puedes conectar al backend luego)
  const ropaData = [
    { title: "Ropa", description: "Descubre nuestra ropa de moda", image: "" },
    { title: "Sudaderas", description: "Mantente abrigado con estilo", image: "" },
    { title: "Camisas", description: "Elegancia y comodidad en cada prenda", image: "" },
  ];

  const zapatillasData = [
    { title: "Zapatillas", description: "Complementa tu look con zapatillas", image: "" },
    { title: "Zapatillas deportivas", description: "Para un rendimiento óptimo", image: "" },
    { title: "Zapatillas casuales", description: "Comodidad para el día a día", image: "" },
  ];

  const gorrasData = [
    { title: "Gorras", description: "Encuentra la gorra perfecta para ti", image: "" },
    { title: "Gorras de béisbol", description: "Estilo clásico y versátil", image: "" },
    { title: "Gorras de moda", description: "Añade un toque único a tu outfit", image: "" },
  ];

  const accesoriosData = [
    { title: "Accesorios", description: "Accesorios para cada ocasión", image: "" },
    { title: "Bolsos", description: "Practicidad y estilo en uno", image: "" },
    { title: "Cinturones", description: "Complementa tu look con elegancia", image: "" },
  ];

  const sections = useMemo(
    () => [
      { id: "ropa", label: "Ropa", data: ropaData },
      { id: "zapatillas", label: "Zapatillas", data: zapatillasData },
      { id: "gorras", label: "Gorras", data: gorrasData },
      { id: "accesorios", label: "Accesorios", data: accesoriosData },
    ],
    []
  );

  // refs por sección para scroll
  const sectionRefs = useRef(
    sections.reduce((acc, s) => ({ ...acc, [s.id]: React.createRef() }), {})
  );

  const [active, setActive] = useState(sections[0].id);
  const [showTop, setShowTop] = useState(false);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id]?.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 84; // compensa navbar fijo
    window.scrollTo({ top: y, behavior: "smooth" });
    setActive(id);
  };

  // Marca el filtro activo según la sección visible
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target?.id) setActive(top.target.id);
      },
      { threshold: 0.4, rootMargin: "-20% 0px -45% 0px" }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id]?.current;
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen text-red-800">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-28 pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_380px_at_100%_-10%,rgba(244,63,94,0.07),transparent),radial-gradient(700px_280px_at_0%_-10%,rgba(244,63,94,0.07),transparent)]"
        />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Colecciones <span className="text-red-600">JFLOWG</span>
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Explora nuestras categorías y encuentra tu próximo favorito.
          </p>
          <div className="mt-4 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-red-300 to-transparent" />
        </div>
      </section>

      {/* FILTROS STICKY (blanco/rojo) */}
      <div className="sticky top-20 z-40 border-y border-red-100 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3 py-3">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
                ${active === s.id
                  ? "bg-red-700 text-white shadow-md"
                  : "text-red-700 border border-red-300 hover:bg-red-50"}`}
                aria-pressed={active === s.id}
              >
                {s.label}
                <span className="ml-2 text-[11px] font-normal text-red-600/80">
                  ({s.data.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-6">
        {sections.map((section) => (
          <section
            id={section.id}
            key={section.id}
            ref={sectionRefs.current[section.id]}
            className="scroll-mt-24 py-14"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">{section.label}</h2>
              <div className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-red-300 to-transparent" />
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {section.data.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <CardProduct
                    name={item.title}
                    description={item.description}
                    variants={[]}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* BOTÓN ARRIBA */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-red-700 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-red-800 transition"
          aria-label="Volver arriba"
        >
          Arriba
        </button>
      )}

      <Footer />
    </div>
  );
}

export default Colecction;
