"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Laptop, Smartphone, Apple } from "lucide-react";

// Category data with images
const categories = [
  {
    id: "laptop",
    name: "Laptop Spare Parts",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
    productCount: 2977,
    icon: Laptop
  },
  {
    id: "laptop-battery",
    name: "Laptop Battery",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    productCount: 464,
    icon: Laptop
  },
  {
    id: "laptop-screen",
    name: "Laptop Screen",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    productCount: 475,
    icon: Laptop
  },
  {
    id: "laptop-adapter",
    name: "Laptop Adapter",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
    productCount: 206,
    icon: Laptop
  },
  {
    id: "laptop-keyboard",
    name: "Laptop Keyboard",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    productCount: 809,
    icon: Laptop
  },
  {
    id: "mobile",
    name: "Mobile Phone Spare Parts",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    productCount: 5188,
    icon: Smartphone
  },
  {
    id: "mobile-camera",
    name: "Mobile Phone Back Camera",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    productCount: 569,
    icon: Smartphone
  },
  {
    id: "iphone",
    name: "iPhone Spare Parts",
    image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop",
    productCount: 1234,
    icon: Apple
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our premium quality spare parts organized by category. Find exactly what you need for your device.
          </p>
        </div>

        {/* Popular Categories Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Browse by Category</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === "all"
                    ? 'bg-[#048567] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#048567] hover:text-[#048567]'
                }`}
              >
                All Categories
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex flex-col items-center text-center transition-all duration-300 ${
                  selectedCategory === category.id ? 'scale-105' : 'hover:scale-105'
                }`}
              >
                <div className={`w-full aspect-square rounded-2xl shadow-md transition-all overflow-hidden mb-3 border-2 ${
                  selectedCategory === category.id
                    ? 'border-[#048567] shadow-xl'
                    : 'border-gray-100 hover:shadow-xl hover:border-[#048567]'
                }`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 px-2">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-xs">
                  {category.productCount.toLocaleString()} products
                </p>
                <div className={`mt-2 h-1 w-6 rounded-full transition-all ${
                  selectedCategory === category.id ? 'bg-[#048567]' : 'bg-transparent'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        {selectedCategory !== "all" && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#048567] bg-opacity-10 rounded-xl">
                {(() => {
                  const category = categories.find(c => c.id === selectedCategory);
                  const Icon = category?.icon || Laptop;
                  return <Icon className="w-6 h-6 text-[#048567]" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {categories.find(c => c.id === selectedCategory)?.name || "Category"}
                </h3>
                <p className="text-gray-600">
                  {categories.find(c => c.id === selectedCategory)?.productCount.toLocaleString()} products available
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Explore our wide range of premium quality spare parts for {categories.find(c => c.id === selectedCategory)?.name.toLowerCase()}. 
              All products are tested for quality and come with warranty.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-[#048567] to-[#036b52] rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-3 uppercase">Need Help Finding Parts?</h2>
          <p className="text-white/90 mb-6 text-lg">
            Can't find what you're looking for? Contact our support team for personalized assistance.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/919994999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#048567] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              Contact Support
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/products"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#048567] transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919994999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.402 0 6.556-5.332 11.891-11.891 11.891-2.016 0-3.991-.512-5.747-1.487l-6.049 1.586zm5.839-3.411c1.554.914 3.097 1.383 4.605 1.383 5.461 0 9.904-4.444 9.904-9.905 0-2.639-1.026-5.123-2.894-6.992-1.866-1.868-4.351-2.895-6.99-2.895-5.467 0-9.911 4.444-9.911 9.905 0 1.748.461 3.42 1.332 4.887l-1.054 3.847 4.008-1.05zm10.596-7.513c-.313-.156-1.854-.915-2.145-1.018-.291-.102-.503-.153-.715.156-.213.311-.82 1.018-1.004 1.222-.185.204-.37.228-.684.072-.313-.156-1.323-.488-2.52-1.555-.931-.83-1.558-1.855-1.742-2.167-.184-.313-.02-.482.137-.638.141-.141.313-.365.469-.547.156-.182.209-.313.313-.522.104-.208.052-.39-.026-.547-.078-.157-.715-1.716-.979-2.352-.257-.619-.519-.533-.715-.543-.184-.009-.396-.011-.611-.011-.215 0-.568.081-.864.406-.297.325-1.133 1.106-1.133 2.693 0 1.587 1.156 3.118 1.316 3.328.16.21 2.274 3.472 5.508 4.868.769.331 1.368.528 1.837.677.77.244 1.472.21 2.025.128.618-.092 1.854-.758 2.118-1.468.264-.71.264-1.32.185-1.448-.078-.127-.291-.204-.604-.36z" />
        </svg>
      </a>
    </div>
  );
}