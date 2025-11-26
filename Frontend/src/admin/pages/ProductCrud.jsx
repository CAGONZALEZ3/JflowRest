import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../services/productService";
import { Pencil, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteProduct } from "../services/adminServices";
import AdminLayout from "../components/shared/AdminLayout";

export default function ProductCrud() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      const data = res.data.products || [];
      setProducts(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (!query.trim()) setFiltered(products);
    else {
      const filteredData = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sub_category_id?.name?.toLowerCase().includes(query)
      );
      setFiltered(filteredData);
      setCurrentPage(1); // Reinicia a la primera página
    }
  };

  const handleRedirection = (product) => {
    navigate("/Products/Update", { state: { product } });
  };

  const handleDelete = async (product) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProduct(product);
      fetchProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  // Cálculo de paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <AdminLayout>
      <div className="mb-10">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra, edita o elimina los productos de tu catálogo.
            </p>
          </div>

          <Link to="/Products/Create">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition-all duration-200">
              <PlusCircle size={18} />
              Nuevo Producto
            </button>
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <div className="flex items-center w-full sm:w-1/2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Buscar por nombre o categoría..."
              className="bg-transparent flex-1 outline-none text-sm text-gray-700"
            />
          </div>

          <p className="text-gray-500 text-sm">
            Total:{" "}
            <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
            productos
          </p>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-indigo-700 uppercase text-xs">
                <th className="py-3 px-4 text-left font-semibold">Producto</th>
                <th className="py-3 px-4 text-left font-semibold">Categoría</th>
                <th className="py-3 px-4 text-left font-semibold">Precio</th>
                <th className="py-3 px-4 text-left font-semibold">Stock</th>
                <th className="py-3 px-4 text-left font-semibold">Estado</th>
                <th className="py-3 px-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((product, i) => {
                const variant = product.variants?.[0] || {};
                const stock = variant.stock || 0;
                const isActive = stock > 0;

                return (
                  <tr key={i} className="border-b hover:bg-indigo-50 transition-colors">
                    <td className="flex items-center gap-3 py-3 px-4">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200 shadow-sm">
                        {variant?.images?.[0] ? (
                          <img
                            src={variant.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold">
                            ?
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-[220px]">
                          {product.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                        {product.sub_category_id?.name || "Sin categoría"}
                      </span>
                    </td>

                    <td className="px-4 font-semibold text-gray-700">
                      ${variant.price?.toFixed(2) || "0.00"}
                    </td>

                    <td className="px-4">
                      <span
                        className={`text-sm font-semibold ${
                          stock > 10
                            ? "text-green-600"
                            : stock > 0
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}
                      >
                        {stock} unidades
                      </span>
                    </td>

                    <td className="px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="text-center px-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleRedirection(product)}
                          title="Editar producto"
                          className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          title="Eliminar producto"
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filtered.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-5">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <p className="text-gray-600 text-sm">
              Página <span className="font-semibold">{currentPage}</span> de{" "}
              <span className="font-semibold">{totalPages}</span>
            </p>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
