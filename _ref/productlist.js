"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrders } from "@/app/action/AdminGetOrders";
import Sidebar from "@/components/SideBar";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, MapPin, Package, Truck } from "lucide-react";
import OrderItemsDropdown from "./OrderItemsDropdown";

const SHOP_ADDRESS = {
  name: "Your Shop Name",
  street: "123 Business Street",
  city: "Business City",
  state: "State",
  zipCode: "12345",
  phone: "123-456-7890"
};

export default function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchOrders = async (startDate = "", endDate = "") => {
    try {
      const response = await getOrders({ startDate, endDate });
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(startDate, endDate);
  }, [startDate, endDate]);

  // Wait for orders to be loaded before filtering
  const filteredOrders = orders ? orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.shippingInfo?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const totalOrdersPrice = filteredOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  

  // Show loading state until orders are fetched
  if (isLoading || orders === null) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{filteredOrders.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalOrdersPrice.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600">Average Order Value</p>
                  <p className="text-2xl font-bold">
                    ${filteredOrders.length > 0 ? (totalOrdersPrice / filteredOrders.length).toFixed(2) : '0.00'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No orders found</div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Order Header */}
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-semibold">{order._id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-semibold">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* From Address */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={18} />
                            <span className="font-semibold">From</span>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p className="font-medium">{SHOP_ADDRESS.name}</p>
                            <p className="text-sm text-gray-600">{SHOP_ADDRESS.street}</p>
                            <p className="text-sm text-gray-600">
                              {SHOP_ADDRESS.city}, {SHOP_ADDRESS.state} {SHOP_ADDRESS.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">{SHOP_ADDRESS.phone}</p>
                          </div>
                        </div>

                        {/* To Address */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Truck size={18} />
                            <span className="font-semibold">Shipping To</span>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p className="font-medium">{order.shippingInfo?.fullName}</p>
                            <p className="text-sm text-gray-600">{order.shippingInfo?.address}</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}
                            </p>
                            <p className="text-sm text-gray-600">{order.shippingInfo?.phoneNumber}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          {/* <Package size={18} />
                          <span className="font-semibold">Order Items</span>
                          <div className="mb-6"> */}
                         <OrderItemsDropdown items={order.items} />
                          {/* </div> */}
                        </div>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b">
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package size={24} />
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Size: {item.size} | Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold">${item.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${order.itemsPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>${order.shippingPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>${order.taxPrice}</span>
                          </div>
                          <div className="flex justify-between font-bold pt-2 border-t">
                            <span>Total</span>
                            <span className="text-green-600">${order.totalPrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6">
                        <Link href={`/admin/Order/${order._id}`}>
                          <Button className="w-full">View Full Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}