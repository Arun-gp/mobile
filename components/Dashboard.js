"use client";
import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,

  ClipboardListIcon
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    ordersThisMonth: 0,
    revenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/products'),
          fetch('/api/admin/users')
        ]);

        const ordersRaw = await ordersRes.json();
        const productsRaw = await productsRes.json();
        const usersRaw = await usersRes.json();

        const orders = Array.isArray(ordersRaw) ? ordersRaw : [];
        const products = Array.isArray(productsRaw) ? productsRaw : [];
        const users = Array.isArray(usersRaw) ? usersRaw : [];

        if (!Array.isArray(ordersRaw) || !Array.isArray(productsRaw) || !Array.isArray(usersRaw)) {
          console.error("One or more APIs failed to return an array", { ordersRaw, productsRaw, usersRaw });
        }

        const totalOrdersThisMonth = orders.filter(
          (order) => order.createdAt && new Date(order.createdAt).getMonth() === new Date().getMonth()
        ).length;

        const totalRevenue = orders.reduce(
          (acc, order) => acc + (order.totalPrice || 0),
          0
        );

        setStats({
          totalUsers: users.length,
          ordersThisMonth: totalOrdersThisMonth,
          revenue: totalRevenue,
        });

        setRecentActivity(
          orders.slice(0, 5).map((order) => ({
            action: "New order placed",
            details: `Order #${order._id} by ${order.shippingInfo?.fullName || 'Guest'}`,
            timestamp: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A',
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data...");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {

              title: "Total Users",
              value: stats.totalUsers,
              color: "text-blue-600"
            },
            {
              icon: <ClipboardListIcon className="w-8 h-8 text-green-500" />,
              title: "Orders This Month",
              value: stats.ordersThisMonth,
              color: "text-green-600"
            },
            {

              title: "Total Revenue",
              value: `₹${stats.revenue.toFixed(2)}`,
              color: "text-purple-600"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow"
            >
              {stat.icon}
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-3 text-gray-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <ClipboardListIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}