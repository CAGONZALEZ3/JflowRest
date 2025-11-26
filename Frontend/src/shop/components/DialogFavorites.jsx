import { useFavorites } from "../../context/FavoritesContext";
import { Trash2 } from "lucide-react";

export default function DialogFavorites({ isOpen, onClose }) {
  const { favorites, remove } = useFavorites();

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 w-full max-w-md bg-white border border-red-100 shadow-2xl rounded-2xl z-50 overflow-y-auto p-6">
      <h2 className="text-xl font-bold mb-4 text-red-700 flex justify-between items-center">
        Mis Favoritos
        <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
          {favorites.length} {favorites.length === 1 ? "artículo" : "artículos"}
        </span>
      </h2>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center text-center py-6">
          <p className="text-gray-600 text-base mb-2">Aún no tienes favoritos.</p>
          <button
            className="px-4 py-2 bg-white text-red-600 border border-red-500 rounded-full hover:bg-red-50 transition"
            onClick={onClose}
          >
            Seguir explorando
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {favorites.map((item, i) => (
              <li key={i} className="bg-gray-50 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                <img
                  src={item.product_variant_id?.images?.[0] || "https://cataas.com/cat?type=square"}
                  alt={item.product_id?.name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product_id?.name}</h3>
                  <p className="text-xs text-gray-500">
                    {item.product_id?.description}
                    {item.product_variant_id?.size ? ` | Talla: ${item.product_variant_id.size}` : ''}
                  </p>
                </div>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => remove({
                    product_id: item.product_id?._id,
                    product_variant_id: item.product_variant_id?._id,
                  })}
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>

          <button className="mt-4 text-sm text-red-600 hover:underline" onClick={onClose}>
            Seguir explorando
          </button>
        </>
      )}
    </div>
  );
}
