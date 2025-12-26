"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SidebarWrapper from "@/components/SidebarWrapper";
import {
  ArrowLeft,
  Trash2,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderDetailsPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/admin/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error("Order not found");
        router.push("/admin/allorder");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [params, router]);

  const handleDelete = async () => {
    const { id } = await params;
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Order deleted successfully");
        router.push("/admin/allorder");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting order");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="rounded-2xl border-gray-200 hover:bg-gray-50 p-2 h-auto"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-4">
                Manifest #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">LOGISTICS COMPLIANCE REPORT</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="destructive"
              onClick={() => setShowConfirm(true)}
              className="rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-0 py-6 px-8 font-black uppercase tracking-widest transition-all"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              VOID SHIPMENT
            </Button>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
          {/* Background Texture */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#048567]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#048567] text-white flex items-center justify-center shadow-lg shadow-[#048567]/20">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Filing Date</p>
                <p className="font-black text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Clearing Status</p>
                <p className="font-black text-blue-600 uppercase tracking-tighter">Verified & Paid</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Logistics Flow</p>
                <p className="font-black text-orange-500 uppercase tracking-tighter">In Transit</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#048567]/10 text-[#048567] flex items-center justify-center border border-[#048567]/20">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Item Count</p>
                <p className="font-black text-gray-900 uppercase tracking-tighter">{order.items?.length || 0} Units</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Shipment Manifest Table */}
            <section className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Cargo Manifest</h2>
                <span className="text-[10px] font-black text-[#048567] uppercase tracking-widest">Inventory Finalized</span>
              </div>

              <div className="p-2">
                <table className="w-full">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                    <tr>
                      <th className="px-8 py-6 text-left">Description</th>
                      <th className="px-8 py-6 text-center">Size</th>
                      <th className="px-8 py-6 text-right">Qty</th>
                      <th className="px-8 py-6 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items?.map((item, index) => (
                      <tr key={index} className="group hover:bg-gray-50/50 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-gray-100 rounded-2xl flex-shrink-0">
                              {/* Image logic if available */}
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package className="w-6 h-6" />
                              </div>
                            </div>
                            <div>
                              <p className="font-black text-gray-900 uppercase tracking-tight text-sm mb-1">{item.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Ref: {index + 101}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            {item.size}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="font-black text-gray-900 italic">x{item.quantity}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="font-black text-[#048567] text-lg italic tracking-tighter">₹{item.price}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-10 bg-gray-50/50 border-t border-gray-50">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                  <div className="space-y-4 flex-1 w-full md:max-w-xs">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Net Value</span>
                      <span className="font-black text-gray-900">₹{order.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Freight Charge</span>
                      <span className="font-black text-gray-900">₹{order.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Duty / Tax</span>
                      <span className="font-black text-gray-900">₹{order.taxPrice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#048567] mb-1">Settlement Total</p>
                    <p className="text-5xl font-black text-gray-900 tracking-tighter italic">₹{order.totalPrice}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-8">
            {/* Customer Passport */}
            <section className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-[#048567] text-white flex items-center gap-4">
                <User className="w-5 h-5 opacity-50" />
                <h2 className="text-lg font-black uppercase tracking-tight italic">Recipient Info</h2>
              </div>
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Customer Profile</h3>
                  <p className="text-xl font-black text-gray-900 uppercase tracking-tight">{order.shippingInfo?.fullName}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Direct Contact</p>
                      <p className="text-sm font-bold text-gray-900">{order.shippingInfo?.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Record</p>
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{order.userEmail || "No record available"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Destination Final */}
            <section className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-black text-white flex items-center gap-4">
                <MapPin className="w-5 h-5 opacity-50" />
                <h2 className="text-lg font-black uppercase tracking-tight italic">Terminal Destination</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-sm font-bold text-gray-600 leading-relaxed mb-4">
                    {order.shippingInfo?.address}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hub</p>
                      <p className="text-xs font-black text-gray-900 uppercase">{order.shippingInfo?.city}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">State Code</p>
                      <p className="text-xs font-black text-gray-900 uppercase">{order.shippingInfo?.state || "IN"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Zip Code</p>
                      <p className="text-xs font-black text-gray-900 uppercase">{order.shippingInfo?.postalCode}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Country</p>
                      <p className="text-xs font-black text-gray-900 uppercase">{order.shippingInfo?.country || "In"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
                <Trash2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 text-center uppercase tracking-tighter italic mb-4">Void Manifest?</h2>
              <p className="text-gray-400 text-center font-bold mb-10 leading-relaxed">
                You are about to permanently remove this shipment from global logs. This action is terminal and cannot be reversed.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-2xl py-8 font-black uppercase text-xs tracking-widest border-2 hover:bg-gray-50"
                  disabled={deleting}
                >
                  ABORT
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 rounded-2xl py-8 font-black uppercase text-xs tracking-widest bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20"
                  disabled={deleting}
                >
                  {deleting ? "VOIDING..." : "CONFIRM VOID"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarWrapper>
  );
}
