// ProductPage.js
"use client";

import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { Package, Shield, ShoppingCart, Plus, Minus, Heart, Truck, RotateCcw, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartContext } from "@/context/CartContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ProductReview from "../ProductReview";
import ZoomableImage from '../ZoomableImage';

export default function ProductPage({ product }) {
  const { addToCart } = useContext(CartContext);
  const [userId, setUserId] = useState(null);
  const initialImage = Array.isArray(product.image) ? product.image[0] : product.image;
  const [selectedImage, setSelectedImage] = useState(initialImage || "/placeholder.jpg");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const { price, discountPercentage, sizes } = product;
  const getPriceForSize = (size) => sizes[size]?.price || price;
  const discountedPrice = (getPriceForSize(selectedSize) * (1 - discountPercentage / 100)).toFixed(2);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const isProductInCart = () => {
    if (!userId) return false;
    const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    return userCart.some(item => item._id === product._id && item.selectedSize === selectedSize);
  };

  const handleQuantityChange = (change) => {
    const maxStock = sizes[selectedSize]?.stock || 0;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    } else {
      toast.warning(newQuantity > maxStock ? "Maximum stock reached!" : "Minimum quantity is 1");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please log in to add to cart");
      router.push("/login");
      return;
    }

    if (sizes[selectedSize]?.stock === 0) {
      toast.error("Size out of stock!");
      return;
    }

    if (quantity > sizes[selectedSize]?.stock) {
      toast.error("Quantity exceeds stock!");
      return;
    }

    await addToCart(product, selectedSize, quantity);
    toast.success("Added to cart!");
  };

  const handleBuyNow = async () => {
    if (!userId) {
      toast.error("Please log in to continue");
      router.push("/login");
      return;
    }

    if (sizes[selectedSize]?.stock === 0) {
      toast.error("Size out of stock!");
      return;
    }

    if (quantity > sizes[selectedSize]?.stock) {
      toast.error("Quantity exceeds stock!");
      return;
    }

    try {
      const buyNowItem = {
        ...product,
        selectedSize,
        quantity
      };
      localStorage.setItem(`buyNow_${userId}`, JSON.stringify([buyNowItem]));
      localStorage.setItem(`isBuyNow_${userId}`, "true");
      router.push("/shipping");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Product Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-gray-100 group">
              <ZoomableImage src={selectedImage} alt={product.name} />
            </div>

            {Array.isArray(product.image) && product.image.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? 'border-[#048567] scale-95 shadow-lg' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Actions */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-[#048567] font-black text-sm uppercase tracking-[0.2em]">
                  KRISH COLLECTIONS
                </div>
                {discountPercentage > 0 && (
                  <div className="bg-[#048567] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md uppercase tracking-wider">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight uppercase tracking-tight">
                {product.name}
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="flex items-baseline space-x-4 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <span className="text-4xl font-black text-gray-900">
                ₹{discountedPrice}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-2xl text-gray-400 line-through font-medium">₹{getPriceForSize(selectedSize)}</span>
                  <span className="text-lg font-black text-[#048567] bg-[#048567]/10 px-4 py-1.5 rounded-full uppercase tracking-tight">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-4 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Select Size</span>
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Stock: {sizes[selectedSize]?.stock || 0} left
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(sizes).map(([size, details]) => {
                  const isAvailable = details.stock > 0;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`relative w-14 h-12 flex items-center justify-center border-2 text-sm font-black uppercase transition-all duration-200 rounded-xl
                        ${isSelected
                          ? 'border-[#048567] bg-[#048567] text-white shadow-lg scale-105'
                          : isAvailable
                            ? 'border-gray-200 text-gray-700 hover:border-[#048567] hover:text-[#048567] cursor-pointer'
                            : 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed'
                        }`}
                    >
                      {size}
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-gray-300 rotate-45 absolute"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="flex items-center justify-between bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center space-x-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-12 w-12 rounded-xl border-2 border-gray-100 hover:border-[#048567] hover:text-[#048567] transition-all"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="w-12 text-center text-xl font-black text-gray-900">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (sizes[selectedSize]?.stock || 0)}
                  className="h-12 w-12 rounded-xl border-2 border-gray-100 hover:border-[#048567] hover:text-[#048567] transition-all"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={isProductInCart() || sizes[selectedSize]?.stock === 0}
                className="w-full py-8 text-xl font-black bg-[#1a1a1a] hover:bg-black text-white rounded-2xl shadow-xl transition-all uppercase tracking-widest"
              >
                {isProductInCart() ? (
                  <span className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-[#048567]" />
                    ADDED TO CART
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <ShoppingCart className="h-6 w-6" />
                    ADD TO CART
                  </span>
                )}
              </Button>

              <Button
                onClick={handleBuyNow}
                className="w-full py-8 text-xl font-black bg-[#048567] hover:bg-[#036e56] text-white rounded-2xl shadow-xl transition-all uppercase tracking-widest"
                disabled={sizes[selectedSize]?.stock === 0}
              >
                <Package className="mr-3 h-6 w-6" />
                BUY IT NOW
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12">
          {/* Product Information */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10">
            <div className="flex items-center gap-4 mb-8">
              <Package className="h-8 w-8 text-[#048567]" />
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                Product Information
              </h2>
            </div>

            <div className="space-y-6">
              {product.details?.material && (
                <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <CheckCircle className="h-6 w-6 text-[#048567] flex-shrink-0" />
                  <div>
                    <p className="font-black text-gray-900 uppercase text-sm tracking-widest">Material</p>
                    <p className="text-gray-500 font-medium mt-1">{product.details.material}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                  <p className="font-bold text-gray-900 uppercase">{product.category}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Available Sizes</p>
                  <p className="font-bold text-gray-900 uppercase">{Object.keys(sizes).join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10">
            <div className="flex items-center gap-4 mb-8">
              <Star className="h-8 w-8 text-[#048567]" />
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                Customer Reviews
              </h2>
            </div>
            <ProductReview productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
}