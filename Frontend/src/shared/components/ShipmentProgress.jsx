import React from "react";
import {
  FaBoxOpen,
  FaTruck,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa";

export default function ShipmentProgress({ status }) {
  // Mapeo de progreso por estado
  const progressMap = {
    processing: { value: 25, label: "Procesando", icon: <FaBoxOpen /> },
    shipped: { value: 50, label: "Enviado", icon: <FaTruck /> },
    in_transit: { value: 75, label: "En tránsito", icon: <FaShippingFast /> },
    delivered: { value: 100, label: "Entregado", icon: <FaCheckCircle /> },
  };

  // Obtener el estado actual o valor por defecto
  const current = progressMap[status] || progressMap.processing;

  // Colores dinámicos según estado
  const color =
    current.value === 100
      ? "bg-green-600"
      : "bg-gradient-to-r from-red-500 to-red-400";

  return (
    <div className="mt-4">
      {/* Títulos */}
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Procesando</span>
        <span>Enviado</span>
        <span>En tránsito</span>
        <span>Entregado</span>
      </div>

      {/* Barra de progreso */}
      <div className="relative w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-700`}
          style={{ width: `${current.value}%` }}
        ></div>

        {/* Iconos del flujo */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {Object.keys(progressMap).map((key) => {
            const step = progressMap[key];
            const active = step.value <= current.value;
            return (
              <div
                key={key}
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                  active
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Texto dinámico */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
        <span>Estado envío:</span>
        <span
          className={`font-semibold capitalize ${
            current.value === 100 ? "text-green-600" : "text-red-600"
          }`}
        >
          {current.label}
        </span>
      </div>
    </div>
  );
}
