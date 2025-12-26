"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShippingPage() {
  const [shippingInfo, setShippingInfo] = useState(null);
  const [cart, setCart] = useState([]);
  const router = useRouter();

  // Load userId (could be from localStorage, context, or an API)
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login"); // Redirect to login page if no userId
      return;
    }

    const storedShippingInfo = localStorage.getItem(`shippingInfo_${userId}`);
    const storedCart = localStorage.getItem(`cart_${userId}`);

    if (storedShippingInfo) {
      setShippingInfo(JSON.parse(storedShippingInfo));
    } else {
      router.push("/shipping-form"); // Redirect if no shipping info is found
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [userId, router]);

  // Calculate discounted price for each item
  const calculateDiscountedPrice = (item) => {
    const selectedSizePrice = item.sizes[item.selectedSize]?.price || item.price;
    const discountPrice = selectedSizePrice - (selectedSizePrice * (item.discountPercentage / 100));
    return discountPrice;
  };

  // Calculate the subtotal (sum of all item prices after discount)
  const subtotal = cart.reduce((total, item) => {
    const discountedPrice = calculateDiscountedPrice(item);
    return total + discountedPrice * item.quantity;
  }, 0);

  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  const shippingPrice = 10.00; // Fixed shipping price
  const totalPrice = (subtotal + tax + shippingPrice).toFixed(2); // Total price including tax and shipping

  const processPayment = () => {
    const data = {
      itemsPrice: subtotal.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: tax.toFixed(2),
      totalPrice
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    router.push("/payment");
  };

  if (!shippingInfo || cart.length === 0) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Confirm Your Order</h2>

      {/* Shipping Information */}
      <div className="space-y-4">
        <p className="font-semibold text-lg">Shipping Information:</p>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Full Name:</strong> {shippingInfo.fullName}</li>
          <li><strong>Address:</strong> {shippingInfo.address}</li>
          <li><strong>City:</strong> {shippingInfo.city}</li>
          <li><strong>Country:</strong> {shippingInfo.country}</li>
          <li><strong>Postal Code:</strong> {shippingInfo.postalCode}</li>
          <li><strong>Phone Number:</strong> {shippingInfo.phoneNumber}</li>
        </ul>
      </div>

      {/* Cart Information */}
      <div className="space-y-4 mt-6">
        <p className="font-semibold text-lg">Cart Summary:</p>
        <ul className="space-y-2 text-gray-700">
          {cart.map((item, index) => {
            // Get the discounted price for the item
            const discountedPrice = calculateDiscountedPrice(item);
            const totalItemPrice = (discountedPrice * item.quantity).toFixed(2);

            return (
              <li
                key={`${item._id}-${item.selectedSize || "default"}-${index}`} // Combining _id, size, and index to ensure unique keys
                className="flex justify-between items-center border-b pb-4"
              >
                <span>{item.name} (x{item.quantity})</span>
                {item.selectedSize && (
                  <span className="text-sm text-gray-500">Size: {item.selectedSize}</span>
                )}
                <span>${totalItemPrice}</span>
              </li>
            );
          })}
        </ul>

        {/* Subtotal */}
        <div className="flex justify-between font-semibold mt-4">
          <p>Subtotal:</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>

        {/* Tax */}
        <div className="flex justify-between font-semibold mt-2">
          <p>Tax (8%):</p>
          <p>${tax.toFixed(2)}</p>
        </div>

        {/* Shipping Price */}
        <div className="flex justify-between font-semibold mt-2">
          <p>Shipping:</p>
          <p>${shippingPrice.toFixed(2)}</p>
        </div>

        {/* Total Price */}
        <div className="flex justify-between font-semibold mt-4 border-t pt-4">
          <p>Total:</p>
          <p>${totalPrice}</p>
        </div>
      </div>

      {/* Proceed to Payment Button */}
      <div className="mt-6">
        <button
          onClick={processPayment}
          className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
