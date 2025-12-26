"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/SideBar';
import { BarChart3, Package, ShoppingCart, TrendingUp, Users, DollarSign } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:scale-[1.02] transition-all duration-500 group">
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="h-8 w-px bg-gray-100"></div>
      <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [totals, setTotals] = useState({
    totalOrders: 0,
    totalStock: 0,
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchTotalsData = async () => {
      setLoading(true);
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/admin/orders')
        ]);

        const productsResRaw = await productsRes.json();
        const ordersRaw = await ordersRes.json();

        const fetchedProducts = Array.isArray(productsResRaw) ? productsResRaw : [];
        const orders = Array.isArray(ordersRaw) ? ordersRaw : [];

        const totalStock = fetchedProducts.reduce((sum, product) => {
          if (product.sizes) {
            return sum + Object.values(product.sizes).reduce((sizeSum, size) => sizeSum + (size.stock || 0), 0);
          }
          return sum + (product.stock || 0);
        }, 0);

        setTotals({
          totalOrders: orders.length,
          totalStock,
          totalPrice: orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0)
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#048567]"></span>
              Real-time Business Performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard
              title="Total Revenue"
              value={formatCurrency(totals.totalPrice)}
              icon={DollarSign}
              color="bg-[#048567]"
            />
            <DashboardCard
              title="Active Orders"
              value={totals.totalOrders}
              icon={ShoppingCart}
              color="bg-orange-500"
            />
            <DashboardCard
              title="Inventory Count"
              value={totals.totalStock}
              icon={Package}
              color="bg-blue-600"
            />
          </div>

          {/* Recent Activity Section Placeholder */}
          <div className="mt-12 bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Recent Activity</h2>
              <button className="text-xs font-black text-[#048567] uppercase tracking-widest hover:underline">View All Reports</button>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Analytics report will appear here soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}