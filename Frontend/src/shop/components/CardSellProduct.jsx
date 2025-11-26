import React from "react";

function CardSellProduct({
  title,
  description,
  price,
  oldPrice,
  image,
  badge,
  badgeColor = "bg-red-400",
}) {
  return (
    <div className="bg-white¿¿ rounded-xl shadow-md w-full max-w-[260px] mx-auto relative transition hover:shadow-lg">
      
      {badge && (
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 text-sm text-white rounded-full ${badgeColor}`}
        >
          {badge}
        </span>
      )}

      <div className="bg-gray-400 flex items-center justify-center h-[140px] overflow-hidden rounded-t-xl">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          
          <img
            src="https://cataas.com/cat?type=square"
            alt="Gatito cuadrado"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="px-4 py-4 text-left">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        <div className="flex justify-between items-center mt-3">
          <div>
            <span className="text-red-500 font-bold text-base">€{price}</span>
            {oldPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                €{oldPrice}
              </span>
            )}
          </div>

          <button className="bg-red-500 hover:bg-red-600 text-white text-sm p-2 rounded-full shadow">
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardSellProduct;
