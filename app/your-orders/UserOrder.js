"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Eye,
  Package,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  MapPin,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Please log in to view your journey.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/orders?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch orders");
      } else {
        setOrders(data.orders || []);
      }
    } catch (error) {
      setError("Connectivity issue. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const OrderDetailsModal = ({ order }) => (
    <Dialog shadow="2xl">
      <DialogTrigger asChild>
        <button
          onClick={() => setSelectedOrder(order)}
          className="w-full mt-6 flex items-center justify-center gap-3 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#048567] hover:text-white transition-all group"
        >
          VIEW MANIFEST <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-[3rem] p-0 border-0 bg-white overflow-hidden shadow-2xl">
        <div className="bg-[#1a1a1a] p-10 text-white">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-sm font-black text-[#048567] uppercase tracking-widest mb-2">Order Manifest</h3>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">#{order._id.slice(-8).toUpperCase()}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
              <span className="px-4 py-1.5 bg-[#048567] rounded-full text-[10px] font-black uppercase tracking-widest">Processing</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 p-8 bg-white/5 rounded-[2rem] border border-white/10">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-[#048567]" />
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Filed On</p>
                <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="w-5 h-5 text-[#048567]" />
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Total Value</p>
                <p className="text-xs font-bold">₹{order.totalPrice}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-5 h-5 text-[#048567]" />
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Payload</p>
                <p className="text-xs font-bold">{order.items?.length} Items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <section>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Vessel Details (Shipping)</h4>
              <div className="space-y-2">
                <p className="text-lg font-black text-gray-900 uppercase tracking-tight">{order.shippingInfo.fullName}</p>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">
                  {order.shippingInfo.address},<br />
                  {order.shippingInfo.city}, {order.shippingInfo.postalCode}<br />
                  {order.shippingInfo.country}
                </p>
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Inventory Breakdown</h4>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700 uppercase tracking-tight line-clamp-1">{item.name} <span className="text-gray-300 ml-2">x{item.quantity}</span></span>
                    <span className="font-black text-gray-900 italic">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-gray-50 p-8 rounded-[2rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Settlement</p>
              <p className="text-3xl font-black text-[#048567] tracking-tighter italic">₹{order.totalPrice}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-[#048567]/20" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] px-4">
        <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8 text-red-500">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic mb-4">{error}</h2>
        <Button onClick={() => window.location.reload()} className="bg-[#048567] hover:bg-[#036e56] text-white px-10 py-7 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#048567]/20">
          Retry Session
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen py-20 lg:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-gray-100 pb-12">
          <div>
            <div className="flex items-center gap-3 text-[#048567] mb-4">
              <Truck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Logistics Overview</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter italic">Your Orders</h1>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-gray-900 italic tracking-tighter">{orders.length}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Shipments</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
              <Package className="w-10 h-10" />
            </div>
            <p className="text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-2">No active shipments</p>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Your style archive is currently empty</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative background number */}
                <span className="absolute -top-4 -right-4 text-[120px] font-black text-gray-50 italic select-none pointer-events-none group-hover:text-[#048567]/5 transition-colors">
                  #{order._id.slice(-2).toUpperCase()}
                </span>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#048567] mb-8">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Confirmed Order</span>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Manifest Reference</h3>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10 pt-8 border-t border-gray-50">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Filed Date</p>
                      <p className="text-xs font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Settlement</p>
                      <p className="text-xs font-black text-[#048567] italic tracking-tight">₹{order.totalPrice}</p>
                    </div>
                  </div>

                  <OrderDetailsModal order={order} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}