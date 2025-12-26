"use client";

import { useState, useEffect } from "react";
import {
  MailIcon,
  ClockIcon,
  UserIcon,
  LocationMarkerIcon,
  CurrencyDollarIcon
} from "@heroicons/react/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/SideBar";

export default function OrderDetail({ params }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetailsData = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/admin/orders/${id}`);
        const result = await response.json();
        if (result.success) {
          setOrder(result.order);
        } else {
          toast.error(result.message || "Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetailsData();
  }, [params]);

  const handleSendEmail = async () => {
    try {
      const response = await fetch('/api/admin/orders/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: order.email || order.shippingInfo?.email,
          orderId: order._id,
          shippingInfo: order.shippingInfo
        })
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Email sent successfully!");
      } else {
        toast.error(result.message || "Error sending email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Order Header */}
          <div className="bg-purple-300 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">Order Details</h1>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm md:text-base">Order ID: {order._id}</p>
              <p className="text-lg md:text-xl font-semibold">
                Total: ₹{order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Content */}
          <div className="p-6 space-y-6">
            {/* Shipping Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <LocationMarkerIcon className="h-6 w-6 mr-2 text-blue-600" />
                Shipping Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Name", value: order.shippingInfo.fullName },
                  { label: "Address", value: order.shippingInfo.address },
                  { label: "City", value: order.shippingInfo.city },
                  { label: "Postal Code", value: order.shippingInfo.postalCode },
                  { label: "Phone", value: order.shippingInfo.phoneNumber },
                  { label: "Country", value: order.shippingInfo.country }
                ].map((info) => (
                  <div key={info.label} className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-gray-500 text-sm">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserIcon className="h-6 w-6 mr-2 text-green-600" />
                Order Items
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
                Financial Details
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Subtotal", value: order.itemsPrice.toFixed(2) },
                  { label: "Tax", value: order.taxPrice.toFixed(2) },
                  { label: "Shipping", value: order.shippingPrice.toFixed(2) }
                ].map((detail) => (
                  <div key={detail.label} className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-gray-500 text-sm">{detail.label}</p>
                    <p className="font-medium">₹{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email Button */}
          <div className="p-6 bg-gray-100 flex justify-center">
            <button
              onClick={handleSendEmail}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <MailIcon className="h-5 w-5 mr-2" />
              Send Order Details
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}