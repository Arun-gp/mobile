"use client"
import { CartContext } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const router = useRouter();

  const handleIncreaseQuantity = (productId, size, stock) => {
    increaseQuantity(productId, size, stock);
  };

  const handleDecreaseQuantity = (productId, size) => {
    decreaseQuantity(productId, size);
  };

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => {
    const selectedSizePrice = item.sizes[item.selectedSize]?.price || item.price;
    const discountPrice = selectedSizePrice - (selectedSizePrice * (item.discountPercentage / 100));
    return total + discountPrice * item.quantity;
  }, 0);

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push("/shipping");
    } else {
      router.push("/login?redirect=shipping");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven&#39;t added anything to your cart yet.</p>
        <Link
          href="/products"
          className="bg-[#048567] text-white px-8 py-3 rounded-full font-bold hover:bg-[#036e56] transition-all"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-black text-gray-900 mb-10 uppercase tracking-tight">Shopping Cart ({cart.length})</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const selectedSizePrice = item.sizes[item.selectedSize]?.price || item.price;
              const discountPrice = selectedSizePrice - (selectedSizePrice * (item.discountPercentage / 100));
              const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image;

              return (
                <div
                  key={`${item._id}-${item.selectedSize}`}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <Image
                      src={imageUrl || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 uppercase tracking-tight line-clamp-1">{item.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <span className="text-[#048567] font-black">₹{discountPrice.toFixed(2)}</span>
                      {item.discountPercentage > 0 && (
                        <span className="text-gray-400 text-xs line-through font-medium">₹{selectedSizePrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="inline-block mt-3 bg-gray-100 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Size: {item.selectedSize}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                      <button
                        onClick={() => handleDecreaseQuantity(item._id, item.selectedSize)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item._id, item.selectedSize, item.sizes[item.selectedSize]?.stock)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id, item.selectedSize)}
                      className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Order Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-[#048567]">FREE</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-lg font-black text-gray-900 uppercase">Total</span>
                  <span className="text-xl font-black text-[#048567]">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#048567] hover:bg-[#036e56] text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-[#048567]/20 transition-all hover:scale-[1.02]"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <span>💳 Visa</span>
                <span>💳 Mastercard</span>
                <span>📱 UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
