import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { addToCart, getCart, removeFromCart, updateCart } from "../services/cartService";

const CartContext = createContext();

const normalizeItem = (item) => ({
  product_id: item.product_id?._id || item.product_id,
  product_variant_id: item.product_variant_id?._id || item.product_variant_id || item.id,
  quantity: item.quantity ?? 1,
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    try {
      const result = await getCart();
      setCart(result?.items || []);
    } catch (err) {
      console.error("Error al cargar el carrito", err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCartHandler = async (item) => {
    try {
      const normalized = normalizeItem(item);
      const existing = cart.find(
        (i) =>
          normalizeItem(i).product_id === normalized.product_id &&
          normalizeItem(i).product_variant_id === normalized.product_variant_id
      );

      if (existing) {
        const updated = {
          ...normalized,
          quantity: existing.quantity + normalized.quantity,
        };
        await updateCart({ items: [updated] });
      } else {
        await addToCart({ items: [normalized] });
      }

      fetchCart();
    } catch (err) {
      console.error("No se pudo agregar al carrito", err);
    }
  };

  const increaseQuantity = async (item) => {
    try {
      const normalized = normalizeItem(item);
      const existing = cart.find(
        (i) =>
          normalizeItem(i).product_id === normalized.product_id &&
          normalizeItem(i).product_variant_id === normalized.product_variant_id
      );

      if (!existing) return;

      const updated = { ...normalized, quantity: existing.quantity + 1 };
      await updateCart({ items: [updated] });

      fetchCart();
    } catch (err) {
      console.error("Error al aumentar cantidad", err);
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      if (item.quantity <= 1) return;

      const normalized = normalizeItem(item);
      const updated = { ...normalized, quantity: item.quantity - 1 };

      await updateCart({ items: [updated] });

      fetchCart();
    } catch (err) {
      console.error("Error al disminuir cantidad", err);
    }
  };

  const removeFromCartHandler = async (item) => {
    try {
      const normalized = normalizeItem(item);
      await removeFromCart(normalized);
      fetchCart();
    } catch (err) {
      console.error("No se pudo eliminar del carrito", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: addToCartHandler,
        removeFromCart: removeFromCartHandler,
        increaseQuantity,
        decreaseQuantity,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
