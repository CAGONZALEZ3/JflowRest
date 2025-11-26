import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Trash2, X } from "lucide-react";
import AdminLayout from "../components/shared/AdminLayout";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../../services/orderService";

export default function GestionPedidos() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | completed | pending | cancelled
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        const data = res.orders || [];
        setOrders(data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };
    fetchOrders();
  }, []);

  // Filtro por búsqueda + pestañas
  useEffect(() => {
    const q = search.trim().toLowerCase();
    const statusSets = {
      completed: new Set(["succeeded", "entregado"]),
      pending: new Set(["pending", "pendiente", "enviado"]),
      cancelled: new Set(["cancelled", "failed"]),
    };

    let list = orders;
    if (activeTab !== "all") {
      const set = statusSets[activeTab];
      list = list.filter((o) => set.has((o.status || "").toLowerCase()));
    }
    if (q) {
      list = list.filter((o) => {
        const name = `${o.user_id?.name || ""} ${o.user_id?.lastName || ""}`.toLowerCase();
        const email = (o.user_id?.email || "").toLowerCase();
        const status = (o.status || "").toLowerCase();
        const id = (o._id || "").toLowerCase();
        const firstProduct = (o.products?.[0]?.name || "").toLowerCase();
        return (
          name.includes(q) ||
          email.includes(q) ||
          status.includes(q) ||
          id.includes(q) ||
          firstProduct.includes(q)
        );
      });
    }
    setFiltered(list);
    setCurrentPage(1);
  }, [orders, search, activeTab]);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
    }
  };

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });

  const statusColors = {
    succeeded: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
    pending: "bg-yellow-100 text-yellow-700",
    enviado: "bg-blue-100 text-blue-700",
    entregado: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
    failed: "bg-red-100 text-red-700",
  };

  const getStatusLabel = (status) => {
    const map = {
      succeeded: "Completado",
      pending: "Pendiente",
      pendiente: "Pendiente",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelled: "Cancelado",
      failed: "Cancelado",
    };
    return map[status] || "Desconocido";
  };

  const currency = (n) =>
    (n ?? 0).toLocaleString("es-ES", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const getAddress = (o) => o.address || "N/A";

  const counts = useMemo(() => {
    const all = orders.length;
    const completed = orders.filter((o) => ["succeeded", "entregado"].includes((o.status || "").toLowerCase())).length;
    const pending = orders.filter((o) => ["pending", "pendiente", "enviado"].includes((o.status || "").toLowerCase())).length;
    const cancelled = orders.filter((o) => ["cancelled", "failed"].includes((o.status || "").toLowerCase())).length;
    return { all, completed, pending, cancelled };
  }, [orders]);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h1>
            <p className="text-gray-500 text-sm mt-1">Administra, visualiza y gestiona los pedidos de tus clientes.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "all", label: `Todos (${counts.all})` },
            { key: "completed", label: `Completados (${counts.completed})` },
            { key: "pending", label: `Pendientes (${counts.pending})` },
            { key: "cancelled", label: `Cancelados (${counts.cancelled})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={
                "px-3 py-1.5 text-sm rounded-full border transition " +
                (activeTab === t.key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <div className="flex items-center w-full sm:w-1/2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Buscar por cliente, pedido o estado..."
              className="bg-transparent flex-1 outline-none text-sm text-gray-700"
            />
          </div>
          <p className="text-gray-500 text-sm">
            Mostrando {paginatedData.length} de {filtered.length} pedidos
          </p>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm text-gray-700">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left"># Pedido</th>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Dirección</th>
                <th className="px-6 py-3 text-center">Fecha</th>
                <th className="px-6 py-3 text-center">Precio</th>
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((order, index) => {
                const shortId = `#${(order._id || "").slice(-8)}`;
                const firstProduct = order.products?.[0]?.name || "-";
                const itemsLabel = order.products && order.products.length > 1 ? ` (+${order.products.length - 1} más)` : "";
                const amount = order.amount ?? order.checkout_session?.amount_total / 100 ?? 0;
                return (
                  <tr
                    key={order._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b hover:bg-indigo-50 transition`}
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">{shortId}</td>
                    <td className="px-6 py-3">
                      <div className="text-gray-900 font-medium">{firstProduct}{itemsLabel}</div>
                      <div className="text-xs text-gray-500">{order.user_id?.name} {order.user_id?.lastName}</div>
                    </td>
                    <td className="px-6 py-3">{getAddress(order)}</td>
                    <td className="px-6 py-3 text-center">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-3 text-center font-semibold">{currency(amount)}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1 transition"
                        >
                          <Eye size={14} /> Ver
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="border border-gray-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1 transition"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500 text-sm">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filtered.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${
                currentPage === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <ChevronLeft size={16} /> Anterior
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full text-sm font-semibold ${
                  currentPage === i + 1 ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${
                currentPage === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Modal Detalles */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white w-[90%] max-w-2xl rounded-xl shadow-lg p-6 relative">
              <button onClick={() => setSelectedOrder(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-2">Detalles del Pedido</h2>
              <p className="text-sm text-gray-500 mb-4">ID del pedido: {selectedOrder._id}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600">Cliente</h3>
                  <p className="text-gray-800">{selectedOrder.user_id?.name} {selectedOrder.user_id?.lastName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user_id?.email}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Estado</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[selectedOrder.status] || "bg-gray-100 text-gray-700"}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded-md text-sm px-2 py-1"
                      value={selectedOrder.status}
                      onChange={(e) => {
                        const v = e.target.value;
                        handleStatusChange(selectedOrder._id, v);
                        setSelectedOrder((prev) => ({ ...prev, status: v }));
                      }}
                    >
                      <option value="succeeded">Completado</option>
                      <option value="pending">Pendiente</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                <div>
                  <div className="text-gray-500">Dirección</div>
                  <div>{getAddress(selectedOrder)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total</div>
                  <div className="font-semibold">{currency(selectedOrder.amount ?? selectedOrder.checkout_session?.amount_total / 100 ?? 0)}</div>
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Productos</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {(selectedOrder.products || []).map((item, i) => (
                    <li key={i} className="flex justify-between border-b pb-2">
                      <span>
                        {item.name} — {item.quantity}
                      </span>
                      <span className="font-medium">{currency(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={() => setSelectedOrder(null)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

