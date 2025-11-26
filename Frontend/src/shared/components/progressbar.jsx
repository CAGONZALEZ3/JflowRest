import React from "react";

export default function ProgressBar({ value = 0, size = "md", color = "blue" }) {
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
    xl: "h-6",
  };

  const heightClass = sizes[size] || sizes.md;

  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className={`bg-${color}-600 ${heightClass} rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
