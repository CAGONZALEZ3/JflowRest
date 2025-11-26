import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, X } from "lucide-react";
import CartButton from "../../shared/components/CartButton";
import { useFavorites } from "../../context/FavoritesContext";

function CardProduct({ _id, name, description, category, variants, showPrice = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { add, remove, isFavorite } = useFavorites();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Variante fallback
  const variant = variants?.[0] || {
    _id: `${_id}-variant`,
    size: "M",
    price: 0,
    images: ["https://cataas.com/cat?type=square"],
    stock: 0,
  };

  const image = variant.images?.[0] || "https://cataas.com/cat?type=square";

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = (variants || [])
      .map(v => Number(v?.price) || 0)
      .filter(Boolean);
    if (!prices.length) return { minPrice: 0, maxPrice: 0 };
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [variants]);

  const product = { _id, name, description, category, variants };

  const priceLabel = showPrice
    ? minPrice === 0 && maxPrice === 0
      ? "$0.00"
      : `$${minPrice.toFixed(2)}`
    : null;

  const inStock = (variant?.stock ?? 0) > 0;

  const handleToggleFavorite = async () => {
    if (!product?._id || !variant?._id) return;
    const pvId = variant._id;
    if (isFavorite(pvId)) {
      await remove({ product_id: product._id, product_variant_id: pvId });
    } else {
      await add({ product_id: product._id, product_variant_id: pvId });
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="flex flex-col w-full max-w-[260px] sm:max-w-[280px] h-full">
        <article className="flex flex-col flex-1 rounded-2xl border border-red-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
          {/* Imagen */}
          <div className="relative rounded-t-2xl overflow-hidden bg-white aspect-[4/3]">
            <Link
              to={`/Products/${_id}`}
              aria-label={`Ver detalles de ${name}`}
              className="block w-full h-full"
            >
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </Link>

            {/* Badge stock */}
            <div className="absolute left-3 top-3">
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                  inStock
                    ? "bg-white text-green-700 border-green-200"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {inStock ? "En stock" : "Sin stock"}
              </span>
            </div>

            {/* Iconos */}
            <div className="absolute top-3 right-3 grid gap-2">
              <button
                onClick={handleToggleFavorite}
                className="bg-white/95 border border-red-100 shadow-sm hover:shadow-md hover:bg-white p-2 rounded-full"
                title="Agregar a favoritos"
              >
                <Heart
                  className="w-4 h-4 text-red-600"
                  fill={isFavorite(variant._id) ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={openModal}
                className="bg-white/95 border border-gray-200 shadow-sm hover:shadow-md hover:bg-white p-2 rounded-full"
                title="Vista rápida"
              >
                <Eye className="w-4 h-4 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex flex-col flex-1 px-5 py-4 justify-between">
            <div>
              {category && (
                <span className="inline-block text-[11px] uppercase tracking-wide text-red-600 font-semibold mb-1">
                  {category}
                </span>
              )}

              <Link to={`/Products/${_id}`}>
                <h3 className="text-base font-bold text-gray-900 leading-snug hover:text-red-700 transition-colors">
                  {name}
                </h3>
              </Link>

              <p className="mt-1 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                {description}
              </p>
            </div>

            {showPrice && (
              <div className="mt-4 flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Precio</span>
                  <span className="text-lg font-extrabold text-red-600">
                    {priceLabel}
                  </span>
                </div>

                <CartButton
                  product={product}
                  variant={variant}
                  disabled={!inStock}
                  className={`ml-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
                    ${
                      inStock
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {inStock ? "Agregar" : "Sin stock"}
                </CartButton>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-red-100 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-extrabold text-gray-900">{name}</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="rounded-xl p-6 flex items-center justify-center min-h-72 border border-gray-100">
                <img
                  src={image}
                  alt={name}
                  className="max-w-full max-h-64 object-contain"
                />
              </div>

              <div className="space-y-4">
                {category && (
                  <span className="inline-block text-xs uppercase tracking-wide text-red-600 font-semibold">
                    {category}
                  </span>
                )}

                <p className="text-[26px] font-extrabold text-red-600">
                  {priceLabel}
                </p>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Descripción</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
                </div>

                <CartButton
                  product={product}
                  variant={variant}
                  disabled={!inStock}
                  className={`w-full py-3 px-6 rounded-xl font-medium mt-4 transition
                    ${
                      inStock
                        ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {inStock ? "Agregar al carrito" : "Sin stock"}
                </CartButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardProduct;
