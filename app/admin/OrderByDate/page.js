"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import SidebarWrapper from "@/components/SidebarWrapper";
import {
  BarChart3,
  Calendar,
  Search,
  Eye,
  Filter,
  DollarSign,
  Package,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/app/action/AdminGetOrders";

export default function OrderListByDate() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async (start = "", end = "") => {
    setIsLoading(true);
    try {
      const response = await getOrders({ startDate: start, endDate: end });
      setOrders(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(startDate, endDate);
  }, [startDate, endDate]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const totalOrdersPrice = filteredOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
      </div>
    );
  }

  return (
    <SidebarWrapper>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              Dispatch Logs
            </h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#048567]"></span>
              Filter and analyze orders by date
            </p>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-6 px-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#048567]/10 flex items-center justify-center text-[#048567]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Period Sales</p>
                <p className="text-xl font-black text-gray-900 leading-none">₹{totalOrdersPrice.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 w-full grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-12 py-6 bg-gray-50 border-0 rounded-2xl font-bold text-xs uppercase"
              />
            </div>
            <div className="relative flex items-center gap-2">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-12 py-6 bg-gray-50 border-0 rounded-2xl font-bold text-xs uppercase"
              />
            </div>
          </div>
          <div className="h-px lg:h-12 w-full lg:w-px bg-gray-100"></div>
          <div className="flex-1 w-full relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <Input
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 py-7 bg-gray-50 border-0 rounded-full font-bold text-sm focus:ring-2 focus:ring-[#048567]"
            />
          </div>
          <Button
            onClick={() => fetchOrders(startDate, endDate)}
            className="rounded-full bg-[#048567] hover:bg-[#036e56] text-white px-8 py-7 font-black uppercase text-[10px] tracking-widest"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filter
          </Button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr>
                <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#048567]">Transaction ID</th>
                <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#048567]">Settlement Value</th>
                <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#048567]">Logistics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#048567] mx-auto"></div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-gray-50/50 transition-all duration-300">
                    <td className="px-10 py-8 font-black text-gray-900 tracking-tighter uppercase">{order._id}</td>
                    <td className="px-10 py-8 font-black text-gray-900 italic">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="px-10 py-8 text-right">
                      <Button
                        onClick={() => router.push(`/admin/OrderByDate/${order._id}`)}
                        className="bg-gray-100 hover:bg-[#048567] text-gray-500 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest px-6 py-4 transition-all"
                      >
                        View Manifest
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-6 h-6 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">No transactions logged for this period</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarWrapper>
  );
}