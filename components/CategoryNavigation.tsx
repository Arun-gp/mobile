"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ShoppingCart, Star, ArrowRight } from "lucide-react";

// Sample product data
const sampleProducts = [
  {
    id: 1,
    title: "iPhone 16 Display",
    category: "Apple",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 234,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766763921/eynnsb6erg8mil1tsg5k.jpg",
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 2,
    title: "Samsung Galaxy S23 Battery",
    category: "Samsung",
    price: 45.99,
    originalPrice: 65.99,
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
    inStock: true,
    badge: "Hot Deal"
  },
  {
    id: 3,
    title: "OnePlus 11 Camera Module",
    category: "OnePlus",
    price: 67.99,
    originalPrice: 89.99,
    rating: 4.3,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    inStock: true,
    badge: null
  },
  {
    id: 4,
    title: "Xiaomi Redmi Note 12 Screen",
    category: "Xiaomi",
    price: 54.99,
    originalPrice: 74.99,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop",
    inStock: true,
    badge: "New Arrival"
  },
  {
    id: 5,
    title: "iPhone 13 Battery Replacement",
    category: "Apple",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop",
    inStock: true,
    badge: null
  },
  {
    id: 6,
    title: "Samsung A54 Charging Port",
    category: "Samsung",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.4,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    inStock: false,
    badge: null
  },
  {
    id: 7,
    title: "Oppo Reno 8 Back Cover",
    category: "Oppo",
    price: 29.99,
    originalPrice: 44.99,
    rating: 4.2,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop",
    inStock: true,
    badge: null
  },
  {
    id: 8,
    title: "Vivo V27 Pro Display Assembly",
    category: "Vivo",
    price: 79.99,
    originalPrice: 109.99,
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    inStock: true,
    badge: "Hot Deal"
  },
  {
    id: 9,
    title: "Realme GT 2 Pro Camera Lens",
    category: "Realme",
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.1,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop",
    inStock: true,
    badge: null
  }
];

export default function ProductShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["All", ...Array.from(new Set(sampleProducts.map(p => p.category)))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sampleProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600 text-lg">Premium quality spare parts for all brands</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Categories */}
          <div className={`flex flex-wrap gap-2 ${!showFilters && 'hidden md:flex'}`}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredAndSortedProducts.length}</span> products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredAndSortedProducts.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.badge}
                  </div>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                )}

                {/* Quick Add Button */}
                {product.inStock && (
                  <button className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
                  {product.category}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={!product.inStock}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Can't find what you're looking for?</h2>
          <p className="text-blue-100 mb-6 text-lg">Contact us and we'll help you find the perfect spare part</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            Contact Support
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}