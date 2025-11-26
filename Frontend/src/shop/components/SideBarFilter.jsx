import React from "react";
import { XCircle } from "lucide-react";

export default function SidebarFilter({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceBounds = [0, 100],
  priceRange = [0, 100],
  onPriceChange,
  sizes = [],
  selectedSizes = [],
  onSizesChange,
  colors = [],
  selectedColors = [],
  onColorsChange,
  onReset,
}) {
  // Cambiar precio desde input
  const handlePriceInput = (index, value) => {
    const num = Number(value);
    if (!isNaN(num)) {
      const updated = [...priceRange];
      updated[index] = num;
      onPriceChange(updated);
    }
  };

  // Cambiar precio desde slider
  const handlePriceSlider = (index, value) => {
    const updated = [...priceRange];
    updated[index] = Number(value);
    onPriceChange(updated);
  };

  // Toggle talla
  const toggleSize = (size) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onSizesChange(next);
  };

  // Toggle color
  const toggleColor = (color) => {
    const next = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    onColorsChange(next);
  };

  return (
    <div className="flex flex-col gap-6 text-gray-700">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-red-600">Filtros</h2>
        <button
          onClick={onReset}
          className="text-sm text-red-600 font-medium flex items-center gap-1 hover:underline"
        >
          <XCircle className="w-4 h-4" /> Limpiar
        </button>
      </div>

      {/* 🔹 Categorías */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all
                  ${
                    selectedCategory === cat
                      ? "bg-red-600 text-white border-red-600"
                      : "border-red-200 text-red-600 hover:bg-red-50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Precio */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Precio</h3>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceInput(0, e.target.value)}
            min={priceBounds[0]}
            max={priceRange[1]}
            className="w-20 border border-red-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:ring-1 focus:ring-red-500 outline-none"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceInput(1, e.target.value)}
            min={priceRange[0]}
            max={priceBounds[1]}
            className="w-20 border border-red-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:ring-1 focus:ring-red-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={priceBounds[0]}
            max={priceBounds[1]}
            value={priceRange[0]}
            onChange={(e) => handlePriceSlider(0, e.target.value)}
            className="w-full accent-red-600"
          />
          <input
            type="range"
            min={priceBounds[0]}
            max={priceBounds[1]}
            value={priceRange[1]}
            onChange={(e) => handlePriceSlider(1, e.target.value)}
            className="w-full accent-red-600 -mt-2"
          />
          <p className="text-xs text-gray-500">
            Rango: {priceRange[0]} – {priceRange[1]}
          </p>
        </div>
      </div>

      {/* 🔹 Tallas */}
      {sizes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Tallas</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold border transition-all
                  ${
                    selectedSizes.includes(size)
                      ? "bg-red-600 text-white border-red-600"
                      : "border-gray-300 text-gray-700 hover:bg-red-50"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Colores */}
      {colors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Colores</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColors.includes(color)
                    ? "ring-2 ring-offset-2 ring-red-600"
                    : ""
                }`}
                style={{
                  backgroundColor: color.toLowerCase(),
                  borderColor:
                    color.toLowerCase() === "white"
                      ? "#ddd"
                      : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

