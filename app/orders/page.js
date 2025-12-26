"use client"

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "../action/OrderAction";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  // Protect route
  useEffect(() => {
    if (!user && !loading) {
      // Optional: Redirect if needed, but let's handle graceful empty state or loading
    }
  }, [user]);

  // Handle form input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  // Calculate the total price of the cart
  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ).toFixed(2);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to place an order");
      return;
    }

    setLoading(true);
    setError('');

    // Prepare order details
    const orderDetails = {
      orderItems: cart.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingInfo,
      itemsPrice: calculateTotalPrice(),
      taxPrice: (calculateTotalPrice() * 0.1).toFixed(2), // 10% tax
      shippingPrice: 10.00, // Flat shipping price
      totalPrice: (
        parseFloat(calculateTotalPrice()) +
        parseFloat((calculateTotalPrice() * 0.1).toFixed(2)) +
        10.00
      ).toFixed(2),
    };

    try {
      // Call the server action to create the order
      const order = await createOrder(orderDetails, user.uid);

      // Order successfully created
      if (order) {
        setOrderStatus('Order placed successfully!');
        clearCart(); // Clear the cart after placing the order
        router.push('/order-success'); // Redirect to the order success page
      }
    } catch (error) {
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">

        <div className="cart-summary bg-gray-50 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          <ul className="space-y-4 mb-6">
            {cart.length > 0 ? (
              cart.map(item => (
                <li key={`${item._id}-${item.selectedSize}`} className="flex justify-between border-b pb-2">
                  <span>{item.name} <span className="text-xs text-gray-500">({item.selectedSize})</span> x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </ul>
          <div className="total-price text-xl font-bold text-right pt-4 border-t border-gray-200">
            Total Price: ${calculateTotalPrice()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-bold">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                required
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  required
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleShippingChange}
                  required
                  className="w-full p-3 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingChange}
                required
                className="w-full p-3 border rounded-xl"
              />
            </div>
          </div>

          {/* Error and Order Status Messages */}
          {error && <p className="text-red-500 font-bold bg-red-50 p-3 rounded-lg">{error}</p>}
          {orderStatus && <p className="text-green-500 font-bold bg-green-50 p-3 rounded-lg">{orderStatus}</p>}

          <div className="actions pt-4">
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-[#048567] text-white py-4 rounded-xl font-bold hover:bg-[#036e56] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
