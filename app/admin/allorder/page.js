"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarWrapper from "@/components/SidebarWrapper";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Package,
  Truck,
  FileDown,
  Calendar,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  Download
} from "lucide-react";
import OrderItemsDropdown from "./OrderItemsDropdown";
import PDFOrderView from './PDFOrderView';

const SHOP_ADDRESS = {
  name: "Aadhana_By_Krish",
  street: "275, Nadu Street",
  city: "Poonachi, Anthiyur",
  state: "Tamil Nadu",
  zipCode: "638314",
  phone: "+91-XXXXXXXXXX"
};

export default function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrdersData = async (start = "", end = "") => {
    try {
      const response = await fetch(`/api/admin/orders?startDate=${start}&endDate=${end}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData(startDate, endDate);
  }, [startDate, endDate]);

  const filteredOrders = orders ? orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.shippingInfo?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const totalOrdersPrice = filteredOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalOrdersPrice / filteredOrders.length : 0;

  const handlePDFDownload = async () => {
    const element = document.getElementById("pdf-content");
    element.classList.remove("hidden");
    const html2pdf = (await import("html2pdf.js")).default;
    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: "orders-summary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      element.classList.add("hidden");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
      </div>
    );
  }

  return (
    <SidebarWrapper>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              Order Management
            </h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#048567]"></span>
              Track and fulfillment your sales
            </p>
          </div>
          <Button
            onClick={handlePDFDownload}
            className="rounded-2xl bg-[#048567] hover:bg-[#036e56] text-white px-8 py-6 font-black uppercase tracking-widest shadow-xl shadow-[#048567]/20 flex items-center gap-3 transition-all hover:scale-[1.02]"
          >
            <FileDown className="w-5 h-5" />
            Export Monthly Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Sales</h3>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{filteredOrders.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 rounded-2xl bg-[#048567] text-white shadow-lg shadow-[#048567]/20">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Gross Revenue</h3>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{totalOrdersPrice.toFixed(0)}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Avg Ticket Size</h3>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{avgOrderValue.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
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
            <div className="relative">
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
              placeholder="Search by ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 py-7 bg-gray-50 border-0 rounded-full font-bold text-sm focus:ring-2 focus:ring-[#048567]"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No matching orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-[#048567]/50 transition-all duration-500">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between mb-10 pb-10 border-b border-gray-50 gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#048567]/10 rounded-[1.5rem] flex items-center justify-center">
                      <Package className="w-8 h-8 text-[#048567]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">System Reference</p>
                      <p className="font-black text-gray-900 tracking-tighter uppercase text-xl">{order._id.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="px-6 py-3 bg-green-50 text-green-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Paid</span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="grid lg:grid-cols-3 gap-12">
                  {/* Shipping Details */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-4 h-4 text-[#048567]" />
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Destination</h4>
                    </div>
                    <div className="p-6 bg-gray-50/50 rounded-3xl space-y-2 border border-gray-100">
                      <p className="font-black text-gray-800 uppercase text-sm tracking-tight">{order.shippingInfo?.fullName}</p>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed">{order.shippingInfo?.address}</p>
                      <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">
                        {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}
                      </p>
                      <div className="pt-2">
                        <p className="text-[10px] font-black text-[#048567] uppercase tracking-widest">Contact Partner</p>
                        <p className="text-xs font-bold text-gray-600">{order.shippingInfo?.phoneNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-[#048567]" />
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Manifest</h4>
                      </div>
                      <OrderItemsDropdown items={order.items} />
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-xl px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                            <div>
                              <p className="font-black text-gray-800 text-sm uppercase tracking-tight">{item.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size {item.size} • Qty {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-black text-gray-900 text-sm italic">₹{item.price}</p>
                        </div>
                      ))}
                    </div>

                    {/* Financial Summary */}
                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          <span>Subtotal</span>
                          <span>₹{order.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          <span>Freight</span>
                          <span>₹{order.shippingPrice}</span>
                        </div>
                      </div>
                      <div className="flex items-end justify-end">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#048567] mb-1">Total Amount</p>
                          <p className="text-3xl font-black text-gray-900 italic tracking-tighter">₹{order.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-8 flex gap-4">
                      <Link href={`/admin/Order/${order._id}`} className="flex-1 group/btn">
                        <Button className="w-full bg-black hover:bg-[#048567] text-white py-7 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2">
                          Full Logistics
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => router.push(`/admin/Order/${order._id}`)} // Or use specific single order download if implemented
                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-7 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] px-8 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Hidden PDF content for batch export */}
        <div id="pdf-content" className="hidden">
          <PDFOrderView orders={filteredOrders} SHOP_ADDRESS={SHOP_ADDRESS} />
        </div>
      </div>
    </SidebarWrapper>
  );
}