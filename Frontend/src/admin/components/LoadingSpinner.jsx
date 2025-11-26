import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
