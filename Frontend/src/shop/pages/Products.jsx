import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SidebarFilter from "../components/SideBarFilter";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import NavBar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import { getAllProducts } from "../../services/productService";
import { Sparkles, Filter, ShoppingBag } from "lucide-react";

const PAGE_SIZE = 9;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [priceBounds, setPriceBounds] = useState([0, 0]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await getAllProducts();
        setProducts(res?.data?.products || []);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setErrMsg("No pudimos cargar el catálogo.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // 🔹 Normalizar estructura
  const normalized = useMemo(() => {
    return (products || []).map((p) => {
      const catName =
        typeof p.sub_category_id === "object"
          ? p.sub_category_id?.name || p.sub_category_id?.slug || "General"
          : "General";

      const prices = Array.isArray(p.variants)
        ? p.variants.map((v) => Number(v.price) || 0).filter((n) => n >= 0)
        : [];

      const minPrice = prices.length ? Math.min(...prices) : 0;

      const sizes = Array.isArray(p.variants)
        ? Array.from(new Set(p.variants.map((v) => String(v.size || "").trim()).filter(Boolean)))
        : [];

      const colors = Array.isArray(p.variants)
        ? Array.from(new Set(p.variants.map((v) => String(v.color || "").trim()).filter(Boolean)))
        : [];

      return { ...p, _categoryName: catName, _minPrice: minPrice, _sizes: sizes, _colors: colors };
    });
  }, [products]);

  // 🔹 Filtros y categorías
  const categories = useMemo(() => {
    const set = new Set(["Todos"]);
    normalized.forEach((p) => set.add(p._categoryName));
    return Array.from(set);
  }, [normalized]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    normalized.forEach((p) => p._sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [normalized]);

  const availableColors = useMemo(() => {
    const set = new Set();
    normalized.forEach((p) => p._colors.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [normalized]);

  useEffect(() => {
    if (!normalized.length) return;
    const mins = normalized.map((p) => p._minPrice);
    const min = Math.min(...mins);
    const max = Math.max(...mins);
    const safeMin = isFinite(min) ? Math.floor(min) : 0;
    const safeMax = isFinite(max) ? Math.ceil(max) : 0;
    setPriceBounds([safeMin, safeMax]);
    setPriceRange([safeMin, safeMax]);
  }, [normalized.length]);

  // 🔹 Filtrado
  const filtered = useMemo(() => {
    return normalized.filter((p) => {
      const byCat = selectedCategory === "Todos" || p._categoryName === selectedCategory;
      const byPrice = p._minPrice >= priceRange[0] && p._minPrice <= priceRange[1];
      const bySize = !selectedSizes.length || p._sizes.some((s) => selectedSizes.includes(s));
      const byColor = !selectedColors.length || p._colors.some((c) => selectedColors.includes(c));
      return byCat && byPrice && bySize && byColor;
    });
  }, [normalized, selectedCategory, priceRange, selectedSizes, selectedColors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, selectedSizes, selectedColors]);

  // 🔹 Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // 🔹 Handlers
  const handleToggleSize = (next) => setSelectedSizes(next);
  const handleToggleColor = (next) => setSelectedColors(next);
  const clearFilters = () => {
    setSelectedCategory("Todos");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(priceBounds);
  };

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-b from-white to-gray-50 text-red-700">
      <NavBar />

      {/* Hero / Encabezado */}
      <section className="relative text-center bg-white border-y border-red-100 py-14 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 tracking-tight">
          Explora nuestro catálogo
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Encuentra tus prendas favoritas y renueva tu estilo con nuestras últimas tendencias.
        </p>
        <div className="mt-5 flex justify-center gap-4">
          <Link
            to="/Home"
            className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition"
          >
            <ShoppingBag className="w-4 h-4 inline-block mr-2" />
            Ir al inicio
          </Link>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 border border-red-400 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
          >
            <Filter className="w-4 h-4 inline-block mr-2" />
            Limpiar filtros
          </button>
        </div>
      </section>

      <main className="max-w-[1500px] mx-auto w-full px-4 sm:px-8 py-14 flex flex-col lg:flex-row gap-10">
        {/* 🔹 Filtro lateral */}
        <aside className="w-full lg:w-[320px] xl:w-[360px]">
          <div className="bg-white border border-red-100 rounded-2xl shadow-md p-6 sticky top-28">
            <SidebarFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceBounds={priceBounds}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              sizes={availableSizes}
              selectedSizes={selectedSizes}
              onSizesChange={handleToggleSize}
              colors={availableColors}
              selectedColors={selectedColors}
              onColorsChange={handleToggleColor}
              onReset={clearFilters}
            />
          </div>
        </aside>

        {/* 🔹 Contenido principal */}
        <section className="flex-1 bg-white rounded-3xl border border-red-100 shadow-lg p-10">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-500 mb-5 flex items-center gap-2">
            <Link to="/Home" className="hover:text-red-600">Inicio</Link>
            <span>/</span>
            <span className="text-red-600 font-semibold">
              {selectedCategory === "Todos" ? "Catálogo" : selectedCategory}
            </span>
          </nav>

          {/* Título dinámico */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-red-700 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-red-500" />
                {selectedCategory === "Todos" ? "Catálogo de productos" : selectedCategory}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {loading
                  ? "Cargando productos..."
                  : `${filtered.length} productos disponibles`}
              </p>
            </div>
          </div>

          {/* Contenido */}
          {errMsg ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errMsg}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-red-100 bg-white p-4"
                >
                  <div className="h-48 rounded-lg bg-red-100/40" />
                  <div className="mt-3 h-3 w-3/4 rounded bg-red-100/60" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-red-100/60" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid place-items-center py-24 text-center">
              <div className="max-w-sm">
                <h3 className="text-lg font-bold text-gray-800">
                  Sin resultados
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Prueba cambiando los filtros o ampliando el rango de precios.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-full border border-red-400 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          ) : (
            <>
              <ProductGrid products={paginated} />
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Products;
