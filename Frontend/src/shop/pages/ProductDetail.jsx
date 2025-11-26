import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import CartButton from "../../shared/components/CartButton";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../services/productService";
import { Heart, Truck, ShieldCheck, RotateCcw } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res);
        const firstVariant = res?.variants?.[0] || null;
        setSelectedVariantId(firstVariant?._id || null);
        setMainImage(firstVariant?.images?.[0] || "");
      } catch (error) {
        setFetchError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const variant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return (
      product.variants.find((v) => String(v._id) === String(selectedVariantId)) ||
      product.variants[0]
    );
  }, [product, selectedVariantId]);

  const allImages = useMemo(() => {
    if (!product?.variants) return [];
    const imgs = product.variants.flatMap((v) => v.images || []);
    return Array.from(new Set(imgs));
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-10">
          <div className="h-[450px] bg-gray-100 animate-pulse rounded-2xl" />
          <div className="space-y-5">
            <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-16 text-center">
          <p className="text-red-600 text-xl font-semibold mb-4">
            {fetchError || "Producto no encontrado."}
          </p>
          <Link
            to="/Products"
            className="text-red-600 hover:text-red-700 font-medium underline"
          >
            ← Volver al catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = Array.from(new Set((product.variants || []).map((v) => v.color).filter(Boolean)));
  const sizes = Array.from(new Set((product.variants || []).map((v) => v.size).filter(Boolean)));

  const pickVariant = (color, size) => {
    const found =
      product.variants.find(
        (v) =>
          (color ? v.color === color : true) &&
          (size ? v.size === size : true)
      ) || product.variants[0];
    setSelectedVariantId(found?._id);
    if (found?.images?.[0]) setMainImage(found.images[0]);
  };

  const onSelectColor = (color) => pickVariant(color, variant?.size);
  const onSelectSize = (size) => pickVariant(variant?.color, size);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen text-gray-900">
      <Navbar />

      <div className="max-w-[1300px] mx-auto px-6 pt-28 pb-20">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/Home" className="hover:text-red-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/Products" className="hover:text-red-600">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* Contenedor principal */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-md border border-red-100 p-8 md:p-10">
          {/* Galería de imágenes */}
          <section>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center h-[470px]">
              <img
                src={mainImage || allImages[0] || "https://cataas.com/cat?type=square"}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-5">
                {allImages.map((img) => (
                  <button
                    key={img}
                    onClick={() => setMainImage(img)}
                    className={`h-20 bg-gray-50 border rounded-lg overflow-hidden ${
                      mainImage === img ? "border-red-600" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Información del producto */}
          <section className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 mt-2 text-base">{product.description}</p>
            </div>

            {/* Precio y stock */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-red-600">
                {variant?.price ? `$${variant.price}` : "--"}
              </span>
              {variant?.stock > 0 ? (
                <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                  En stock • {variant.stock} unidades
                </span>
              ) : (
                <span className="text-xs font-medium text-red-700 bg-red-100 px-3 py-1.5 rounded-full">
                  Sin stock
                </span>
              )}
            </div>

            {/* Colores */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => onSelectColor(c)}
                      className={`px-4 py-1.5 rounded-lg text-sm border transition-all ${
                        variant?.color === c
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-300 hover:border-red-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tallas */}
            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Talla</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSelectSize(s)}
                      className={`px-4 py-1.5 rounded-lg text-sm border transition-all ${
                        variant?.size === s
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-300 hover:border-red-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col gap-3">
              <CartButton
                product={product}
                variant={variant}
                className="w-full bg-red-600 text-white py-3.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
              />
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-red-600 text-red-600 py-3.5 rounded-lg font-medium hover:bg-red-50 transition"
              >
                <Heart className="w-4 h-4" /> Agregar a favoritos
              </button>
            </div>

            {/* Información adicional */}
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Detalles del producto
              </h4>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Calidad garantizada y materiales premium</li>
                <li>Envío rápido y seguro a todo el país</li>
                <li>Soporte al cliente disponible 24/7</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Sección de beneficios */}
        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <Truck className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Envíos rápidos</p>
              <p className="text-xs text-gray-600">Gratis en compras mayores a $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <RotateCcw className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Devoluciones fáciles</p>
              <p className="text-xs text-gray-600">Hasta 30 días sin complicaciones</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Pago seguro</p>
              <p className="text-xs text-gray-600">Aceptamos Yappy, Visa y Stripe</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
