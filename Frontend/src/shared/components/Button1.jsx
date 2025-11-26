
import React from "react";

function Button1({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        middle none center 
        mr-3 rounded-full 
        bg-gradient-to-tr from-[#ff6b6b] to-[#ff4d4d] 
        py-3 px-6 font-sans text-xs font-bold uppercase text-white 
        shadow-md shadow-[#ff6b6b]/40 
        transition-all hover:shadow-lg hover:shadow-[#ff4d4d]/50 
        active:opacity-[0.85] 
        disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none 
        ${className}
      `}
      data-ripple-light="true"
    >
      {children}
    </button>
  );
}

export default Button1;
