// app/payment-success/page.js (for Next.js 13+ with app directory)
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Home, Package, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation
    setIsAnimating(true);
    
    // Get order details from session storage if available
    const orderInfo = sessionStorage.getItem("orderInfo");
    if (orderInfo) {
      try {
        setOrderDetails(JSON.parse(orderInfo));
      } catch (error) {
        console.error("Error parsing order info:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Animated Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
          {/* Success Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
              <CheckCircle className="w-20 h-20 text-green-500 relative z-10" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Thank you for your purchase! Your order has been confirmed and will be shipped soon.
            </p>
          </div>

          {/* Order Summary */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <Package className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Total:</span>
                  <span className="font-medium">₹{orderDetails.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">₹{orderDetails.shippingPrice}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-800 font-semibold">Total Paid:</span>
                  <span className="text-green-600 font-bold text-lg">₹{orderDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-blue-700 text-sm">
                A confirmation email has been sent to your registered email address with all the order details.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Homepage
            </button>
            
            <button
              onClick={() => router.push("/YourOrder")}
              className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              View My Orders
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <a 
                href="mailto:aadhanaa.krishcollections@gmail.com" 
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>
    </div>
  );
}