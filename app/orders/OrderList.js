"use client";
import React from "react";

export default function OrderList({ cartItems, total }) {
  return (
    <>
      <div className="cart-items mb-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="cart-item flex items-center justify-between mb-4 p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              {/* Product Image */}
              <div className="flex items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <span className="text-sm font-semibold text-gray-700">
                  {item.product.name}
                </span>
              </div>

              {/* Quantity and Price */}
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-600">
                  {item.quantity} x ${item.product.price.toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-gray-800">
                  ${ (item.quantity * item.product.price).toFixed(2) }
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {cartItems.length > 0 && (
        <div className="total bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-800">Subtotal:</span>
            <span className="text-lg font-semibold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-800">Shipping:</span>
            <span className="text-lg font-semibold text-gray-900">$5.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Total:</span>
            <span className="text-lg font-semibold text-gray-900">
              ${(total + 5.0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
