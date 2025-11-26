import { createContext, useContext, useEffect, useState } from "react";
import { addToFavorites, getFavorites, removeFromFavorites } from "../services/favoritesService";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const result = await getFavorites();
      setFavorites(result?.items || []);
    } catch (err) {
      console.error("Error al cargar favoritos", err);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const add = async ({ product_id, product_variant_id }) => {
    await addToFavorites({ items: [{ product_id, product_variant_id }] });
    await fetchFavorites();
  };

  const remove = async ({ product_id, product_variant_id }) => {
    await removeFromFavorites({ product_id, product_variant_id });
    await fetchFavorites();
  };

  const isFavorite = (product_variant_id) =>
    favorites.some(i => (i.product_variant_id?._id || i.product_variant_id) === product_variant_id);

  return (
    <FavoritesContext.Provider value={{ favorites, add, remove, isFavorite, refresh: fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);

