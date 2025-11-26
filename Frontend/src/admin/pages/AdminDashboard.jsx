import React, { useEffect, useState } from "react";
import AdminLayout from "../components/shared/AdminLayout";
import {
  getAllProducts,
  getAllUsers,
  getAllReturns,
  getAdminOverview,
  getAuditEvents,
} from "../services/adminServices";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardStats from "../components/DashboardStats";
import DashboardCharts from "../components/DashboardCharts";
import RecentActivity from "../components/RecentActivity";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [recent, setRecent] = useState([]);
  const [totals, setTotals] = useState({
    products: 0,
    users: 0,
    returns: 0,
    activeOrders: "--",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [resProducts, resUsers, resReturns, resOverview, resAudit] =
          await Promise.all([
            getAllProducts(),
            getAllUsers(),
            getAllReturns(),
            getAdminOverview({ days: 14 }),
            getAuditEvents({ limit: 10 }),
          ]);

        const productCount =
          resProducts?.data?.count ??
          resProducts?.data?.products?.length ??
          0;
        const userCount =
          resUsers?.users?.filter((u) => u.role === 200).length || 0;
        const returnsCount =
          resReturns?.items?.length || resReturns?.data?.items?.length || 0;

        const totalOrders = resOverview?.totals?.orders ?? 0;
        const succeeded = resOverview?.ordersByStatus?.succeeded ?? 0;
        const failed = resOverview?.ordersByStatus?.failed ?? 0;
        const activeOrders = Math.max(totalOrders - (succeeded + failed), 0);

        setTotals({
          products: productCount,
          users: userCount,
          returns: returnsCount,
          activeOrders,
        });

        setOverview(resOverview);
        setRecent(resAudit?.items || []);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <AdminLayout>
        <LoadingSpinner message="Cargando datos del dashboard..." />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-red-600">Dashboard</h1>
        <p className="text-xs text-gray-500">
          Estadísticas generales de tu tienda
        </p>
      </div>

      <div className="space-y-4">
        {/* 🔹 Sección de estadísticas */}
        <div className="scale-95">
          <DashboardStats totals={totals} />
        </div>

        {/* 🔹 Gráficos principales (ventas y órdenes) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <DashboardCharts overview={overview} compact />
          </div>

          {/* 🔹 Actividad reciente a la derecha en pantallas grandes */}
          <div className="hidden lg:block">
            <RecentActivity recent={recent} compact />
          </div>
        </div>

        {/* 🔹 Actividad reciente visible abajo solo en móvil */}
        <div className="block lg:hidden">
          <RecentActivity recent={recent} compact />
        </div>
      </div>
    </AdminLayout>
  );
}
