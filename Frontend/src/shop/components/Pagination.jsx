import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // No mostrar si solo hay una página

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const getPagesToShow = () => {
    const range = [];
    const delta = 2; // cantidad de botones visibles antes y después
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  const pages = getPagesToShow();

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 select-none">
      {/* Botón anterior */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition
          ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500"
          }`}
      >
        <ChevronLeft className="w-4 h-4" /> Anterior
      </button>

      {/* Números */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="px-3 py-2 rounded-lg border border-red-300 bg-white text-red-600 text-sm font-semibold hover:bg-red-50"
          >
            1
          </button>
          {pages[0] > 2 && <span className="text-gray-400 text-sm">…</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all
            ${
              page === currentPage
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500"
            }`}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-gray-400 text-sm">…</span>
          )}
          <button
            onClick={() => goToPage(totalPages)}
            className="px-3 py-2 rounded-lg border border-red-300 bg-white text-red-600 text-sm font-semibold hover:bg-red-50"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón siguiente */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition
          ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500"
          }`}
      >
        Siguiente <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
