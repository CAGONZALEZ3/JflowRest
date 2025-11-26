import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/shared/AdminLayout";
import { getAllReturns, createReturn, updateReturnStatus, deleteReturn } from "../../services/returnService";
import { Search, Plus, ChevronLeft, ChevronRight, Eye, Trash2, X } from "lucide-react";

export default function GestionDevolucion() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const res = await getAllReturns();
      setItems(res.items || []);
    } catch (e) {
      console.error("Error cargando devoluciones", e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    const statusSets = {
      requested: new Set(["requested"]),
      approved: new Set(["approved", "received"]),
      refunded: new Set(["refunded"]),
      rejected: new Set(["rejected"]),
    };
    let list = items;
    if (activeTab !== "all") {
      const set = statusSets[activeTab];
      list = list.filter((r) => set.has((r.status || "").toLowerCase()));
    }
    if (q) {
      list = list.filter((r) => {
        const user = `${r.user_id?.name || ""} ${r.user_id?.lastName || ""}`.toLowerCase();
        const email = (r.user_id?.email || "").toLowerCase();
        const reason = (r.reason || "").toLowerCase();
        const id = (r._id || "").toLowerCase();
        const order = (r.order_id?._id || "").toLowerCase();
        return user.includes(q) || email.includes(q) || reason.includes(q) || id.includes(q) || order.includes(q);
      });
    }
    setFiltered(list);
    setCurrentPage(1);
  }, [items, search, activeTab]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const start = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(start, start + itemsPerPage);
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  const formatDate = (d) => new Date(d).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
  const statusColors = {
    requested: "bg-amber-100 text-amber-700",
    approved: "bg-blue-100 text-blue-700",
    received: "bg-indigo-100 text-indigo-700",
    refunded: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
  };
  const statusLabel = (s) => ({ requested: "Solicitada", approved: "Aprobada", received: "Recibida", refunded: "Reembolsada", rejected: "Rechazada" }[s] || s);
  const currency = (n) => (n ?? 0).toLocaleString("es-ES", { style: "currency", currency: "USD" });

  const counts = useMemo(() => {
    const all = items.length;
    const requested = items.filter((i) => i.status === "requested").length;
    const approved = items.filter((i) => ["approved", "received"].includes(i.status)).length;
    const refunded = items.filter((i) => i.status === "refunded").length;
    const rejected = items.filter((i) => i.status === "rejected").length;
    return { all, requested, approved, refunded, rejected };
  }, [items]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      order_id: fd.get('order_id') || undefined,
      reason: fd.get('reason') || undefined,
      method: fd.get('method') || 'refund',
      refund_amount: fd.get('refund_amount') ? Number(fd.get('refund_amount')) : undefined,
      items: [],
      notes: fd.get('notes') || undefined,
    };
    try {
      await createReturn(payload);
      setShowCreate(false);
      e.currentTarget.reset();
      await fetchData();
    } catch (err) {
      console.error('Error creando devolución', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateReturnStatus(id, { status });
      setItems((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error('Error actualizando devolución', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar devolución?')) return;
    try {
      await deleteReturn(id);
      setItems((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Error eliminando devolución', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Devoluciones</h1>
            <p className="text-gray-500 text-sm mt-1">Registra y controla las solicitudes de devolución.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus size={16} /> Nueva devolución
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "all", label: `Todas (${counts.all})` },
            { key: "requested", label: `Solicitadas (${counts.requested})` },
            { key: "approved", label: `Aprobadas/Recibidas (${counts.approved})` },
            { key: "refunded", label: `Reembolsadas (${counts.refunded})` },
            { key: "rejected", label: `Rechazadas (${counts.rejected})` },
          ].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={("px-3 py-1.5 text-sm rounded-full border " + (activeTab === t.key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")).trim()}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center w-full sm:w-1/2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 mb-6">
          <Search size={18} className="text-gray-500 mr-2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por cliente, pedido o motivo..." className="bg-transparent flex-1 outline-none text-sm text-gray-700" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm text-gray-700">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left"># Devolución</th>
                <th className="px-6 py-3 text-left">Pedido</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Motivo</th>
                <th className="px-6 py-3 text-center">Fecha</th>
                <th className="px-6 py-3 text-center">Importe</th>
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((r, i) => (
                <tr key={r._id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b`}>
                  <td className="px-6 py-3 font-medium">#{String(r._id).slice(-8)}</td>
                  <td className="px-6 py-3">#{String(r.order_id?._id || '').slice(-8)}</td>
                  <td className="px-6 py-3">{r.user_id?.name} {r.user_id?.lastName}<div className="text-xs text-gray-500">{r.user_id?.email}</div></td>
                  <td className="px-6 py-3">{r.reason || '-'}</td>
                  <td className="px-6 py-3 text-center">{formatDate(r.createdAt)}</td>
                  <td className="px-6 py-3 text-center font-semibold">{currency(r.refund_amount)}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>{statusLabel(r.status)}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1" onClick={() => setSelected(r)}>
                        <Eye size={14} /> Ver
                      </button>
                      <button className="border border-gray-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1" onClick={() => handleDelete(r._id)}>
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500 text-sm">No se encontraron devoluciones.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button onClick={prevPage} disabled={currentPage === 1} className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-indigo-600 border-indigo-300 hover:bg-indigo-50'}`}>
              <ChevronLeft size={16} /> Anterior
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`w-8 h-8 rounded-full text-sm font-semibold ${currentPage === idx + 1 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>{idx + 1}</button>
            ))}
            <button onClick={nextPage} disabled={currentPage === totalPages} className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-indigo-600 border-indigo-300 hover:bg-indigo-50'}`}>
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Modal Crear */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg p-6 relative">
              <button onClick={() => setShowCreate(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><X size={20} /></button>
              <h2 className="text-lg font-semibold mb-4">Registrar devolución</h2>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">ID de pedido</label>
                  <input name="order_id" placeholder="64f..." className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Motivo</label>
                  <input name="reason" placeholder="Producto dañado, talla incorrecta, ..." className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Método</label>
                    <select name="method" className="w-full border rounded-md px-2 py-2 text-sm">
                      <option value="refund">Reembolso</option>
                      <option value="exchange">Cambio</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Importe estimado</label>
                    <input name="refund_amount" type="number" step="0.01" className="w-full border rounded-md px-3 py-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Notas</label>
                  <textarea name="notes" rows="3" className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="border px-4 py-2 rounded-md">Cancelar</button>
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detalle */}
        {selected && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-2xl rounded-xl shadow-lg p-6 relative">
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><X size={20} /></button>
              <h2 className="text-lg font-semibold mb-2">Devolución #{String(selected._id).slice(-8)}</h2>
              <p className="text-sm text-gray-500 mb-4">Pedido asociado: #{String(selected.order_id?._id || '').slice(-8)}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-500">Cliente</div>
                  <div>{selected.user_id?.name} {selected.user_id?.lastName}</div>
                  <div className="text-gray-500 text-xs">{selected.user_id?.email}</div>
                </div>
                <div>
                  <div className="text-gray-500">Estado</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[selected.status] || 'bg-gray-100 text-gray-700'}`}>{statusLabel(selected.status)}</span>
                    <select className="border rounded-md text-sm px-2 py-1" value={selected.status} onChange={(e) => { const v = e.target.value; handleUpdateStatus(selected._id, v); setSelected((p) => ({ ...p, status: v })); }}>
                      <option value="requested">Solicitada</option>
                      <option value="approved">Aprobada</option>
                      <option value="received">Recibida</option>
                      <option value="refunded">Reembolsada</option>
                      <option value="rejected">Rechazada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-500">Motivo</div>
                  <div>{selected.reason || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Importe</div>
                  <div className="font-semibold">{currency(selected.refund_amount)}</div>
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Productos</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {(selected.items || []).map((it, idx) => (
                    <li key={idx} className="flex justify-between border-b pb-2"><span>{it.name} — {it.quantity}</span><span className="font-medium">{currency(it.price)}</span></li>
                  ))}
                  {(!selected.items || selected.items.length === 0) && (
                    <li className="text-gray-500">No se detallaron productos.</li>
                  )}
                </ul>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={() => setSelected(null)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

