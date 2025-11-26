import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

export default function CartButton({ product, variant }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    if (!product || !variant) {
      toast.error("No se pudo agregar: producto o variante no disponible");
      return;
    }

    // Si el backend/variant trae stock, evita agregar cuando no hay
    if (typeof variant.stock === "number" && variant.stock <= 0) {
      toast.info("Sin stock disponible");
      return;
    }

    const item = {
      id: variant._id,
      product_id: product._id,
      title: product.name,
      description: product.description,
      price: Number(variant.price) || 0,
      size: variant.size,
      image: variant.images?.[0],
      quantity: 1,
    };

    try {
      setIsAdding(true);
      await addToCart(item);
      toast.success(`Agregado: ${product.name} (${variant.size})`);
    } catch (e) {
      const msg = e?.message || "No se pudo agregar al carrito";
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const disabled = isAdding || (typeof variant?.stock === "number" && variant.stock <= 0);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isAdding ? "Agregando..." : "Agregar"}
    </button>
  );
}
