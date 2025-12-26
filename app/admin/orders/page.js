"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);

  const fetchOrders = async (start = "", end = "") => {
    setIsLoading(true);
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

  // Fetch orders when the component mounts or when dates change
  useEffect(() => {
    fetchOrders(startDate, endDate);
  }, [startDate, endDate]); // Dependency array ensures fetch on date changes

  // Calculate the total price of all orders
  const totalOrdersPrice = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div className="p-8 bg-gradient-to-r from-green-400 via-teal-500 to-cyan-600 text-white shadow-xl rounded-lg">
      <h2 className="text-4xl font-bold text-center mb-8">Order Summary</h2>

      {/* Date Range Filter */}
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center gap-6">
          {/* Start Date */}
          <div className="flex flex-col items-center">
            <label className="block text-gray-200 mb-2">Start Date:</label>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-md bg-yellow-500 text-gray-800 appearance-none focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col items-center">
            <label className="block text-gray-200 mb-2">End Date:</label>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-md bg-yellow-500 text-gray-800 appearance-none focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => fetchOrders(startDate, endDate)} // Trigger fetch manually if needed
            className="px-4 py-2 mt-7 border border-gray-300 rounded-md bg-yellow-500 text-gray-800 appearance-none focus:outline-none"
          >
            Filter Orders
          </button>
        </div>
      </div>

      {/* Total Price of all Orders */}
      <div className="mb-8 text-center">
        <p className="text-2xl font-semibold text-gray-800">
          Total Orders Price: <span className="text-green-600">₹{totalOrdersPrice.toFixed(2)}</span>
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-300">Loading orders...</div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 border-2 border-gray-300 rounded-lg shadow-lg bg-white text-gray-800"
            >
              {/* Order ID and Total Price */}
              <div className="mb-4">
                <p className="font-semibold text-xl text-indigo-600">
                  Order ID: <span className="text-gray-700">{order._id}</span>
                </p>
                <p className="font-semibold text-xl text-green-500">
                  Total Price: <span className="text-gray-700">₹{order.totalPrice}</span>
                </p>
              </div>

              {/* Order Dates */}
              <div className="mb-6">
                <p className="font-semibold text-lg text-gray-800">Order Dates</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Tax and Shipping Price */}
              <div className="mb-4">
                <div className="flex justify-between">
                  <p className="font-medium text-lg text-yellow-500">
                    Tax Price: <span className="text-gray-700">₹{order.taxPrice}</span>
                  </p>
                  <p className="font-medium text-lg text-blue-500">
                    Shipping Price: <span className="text-gray-700">₹{order.shippingPrice}</span>
                  </p>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-6">
                <p className="font-semibold text-lg text-gray-800">Shipping Information</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600 w-32">Name:</span>
                    <span>{order.shippingInfo.fullName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600 w-32">Address:</span>
                    <span>{order.shippingInfo.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600 w-32">City:</span>
                    <span>{order.shippingInfo.city}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600 w-32">Postal Code:</span>
                    <span>{order.shippingInfo.postalCode}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600 w-32">Phone Number:</span>
                    <span>{order.shippingInfo.phoneNumber}</span>
                  </div>
                  {/* Added Country */}
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600 w-32">Country:</span>
                    <span>{order.shippingInfo.country}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-6">
                <p className="font-semibold text-lg text-gray-800">Items</p>
                <table className="min-w-full table-auto mt-2 border-collapse text-gray-800">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">₹{item.price}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total with Discount Price */}
              <p className="text-blue-600 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Total with Discount Price:{" "}
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
                  ₹{order.itemsPrice}
                </span>
              </p>

              {/* Order Details Link */}
              <div className="text-center mt-6">
                <Link href={`/admin/Order/${order._id}`}>
                  <button className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600">
                    View Order Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
