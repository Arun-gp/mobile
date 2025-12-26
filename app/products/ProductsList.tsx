"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilters } from "@/components/ProductFilters";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  discountPercentage: number;
  sizes?: {
    [key: string]: {
      stock: number;
      price: number;
    }
  };
}

interface ProductsListProps {
  filteredProducts: Product[];
  page: number;
  totalPages: number;
  currentCategory: string;
  priceRange: { min: number; max: number };
}

export default function ProductsList({
  filteredProducts,
  page,
  totalPages,
  currentCategory,
  priceRange
}: ProductsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth() as { user: { uid: string } | null };
  const [category, setCategory] = useState<string>(currentCategory || "");
  const [query, setQuery] = useState<string>(searchParams.get("query") || "");

  const [priceFilter, setPriceFilter] = useState<number[]>([
    parseInt(searchParams.get("minPrice") || "0") || priceRange?.min || 0,
    parseInt(searchParams.get("maxPrice") || "10000") || priceRange?.max || 10000
  ]);

  const categories = [
    "Gown",
    "Chudithars",
    "Shawl",
    "Night Dress",
    "Leggins"
  ];

  const sizeOrder = ["S", "M", "L", "XL", "XXL"];

  const addToWishlist = async (product: Product) => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          productId: product._id,
          productData: {
            name: product.name,
            price: product.price,
            image: product.image
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.info(data.message);
      }
    } catch (e) {
      toast.error("Failed to add to wishlist");
    }
  };

  const updateFilters = (newCategory: string, newPrice: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) params.set("category", newCategory);
    else params.delete("category");

    if (newPrice) {
      params.set("minPrice", "0");
      params.set("maxPrice", newPrice.toString());
    }

    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("query", query);
    else params.delete("query");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
    return Math.floor(price * (1 - discountPercentage / 100));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header - Minimalist */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Our Collection</h1>
            <p className="text-gray-500">Premium quality for your everyday look</p>
          </div>

          <div className="flex gap-4 items-center">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-indigo-600" />
              <Input
                placeholder="Search..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 focus:w-64 transition-all duration-300 border-gray-200 rounded-full bg-gray-50"
              />
            </form>

            <ProductFilters
              categories={categories}
              selectedCategory={category}
              setSelectedCategory={(c: string) => {
                setCategory(c);
                updateFilters(c, priceFilter[1] ?? 10000);
              }}
              priceRange={priceFilter[1] ?? 10000}
              setPriceRange={(p: number) => {
                setPriceFilter([0, p]);
                updateFilters(category, p);
              }}
              minPrice={0}
              maxPrice={priceRange?.max ?? 10000}
            />
          </div>
        </div>

        {/* Category Buttons - Styled pill shape */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => {
              setCategory("");
              updateFilters("", priceFilter[1] ?? 10000);
            }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${!category ? 'bg-[#048567] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                updateFilters(cat, priceFilter[1] ?? 10000);
              }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${category === cat ? 'bg-[#048567] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid - More columns for smaller image footprint */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 gap-y-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col">
                {/* Image Container - Square and compact */}
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gray-50 mb-4 shadow-sm border border-gray-100">
                  <Link href={`/product/${product._id}`} className="block w-full h-full">
                    {product.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-[#048567] text-white text-[10px] font-black px-2 py-1 rounded shadow-sm tracking-wider uppercase">NEW</span>
                    {product.discountPercentage > 0 && (
                      <span className="bg-[#cc0000] text-white text-[10px] font-black px-2 py-1 rounded shadow-sm tracking-wider uppercase">-{product.discountPercentage}%</span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToWishlist(product);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                  >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow px-1">
                  <span className="text-[10px] font-black text-[#048567] uppercase tracking-widest mb-1.5 px-0.5">
                    {product.category || "General"}
                  </span>

                  <Link href={`/product/${product._id}`}>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 leading-tight group-hover:text-[#048567] transition-colors min-h-[2.5rem] line-clamp-2 uppercase tracking-tight">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[#048567] font-black text-lg">
                      ₹{calculateDiscountedPrice(product.price, product.discountPercentage)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <>
                        <span className="text-gray-400 text-xs translate-y-0.5 line-through font-medium">₹{product.price}</span>
                        <span className="text-[#048567] text-[10px] translate-y-0.5 font-black uppercase">{product.discountPercentage}% OFF</span>
                      </>
                    )}
                  </div>

                  {/* Divider Line before Sizes */}
                  <div className="h-px w-full bg-gray-100 mb-4"></div>

                  {/* Size Selection UI - Dynamic */}
                  <div className="mt-auto">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Size:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(product.sizes || {}).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)).map((size) => {
                        const sizeData = product.sizes?.[size];
                        const isAvailable = sizeData && sizeData.stock > 0;
                        return (
                          <div
                            key={size}
                            className={`w-9 h-14 flex items-center justify-center border text-[11px] font-black transition-all rounded-[1.2rem] ${isAvailable
                              ? 'border-gray-200 text-black bg-white hover:border-[#048567] hover:text-[#048567] cursor-pointer'
                              : 'border-gray-100 text-gray-300 bg-gray-50/50 relative overflow-hidden'
                              }`}
                          >
                            {size}
                            {!isAvailable && (
                              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-30">
                                <div className="w-full h-[1px] bg-gray-400 rotate-[55deg]"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-gray-400 mb-4"><Search className="h-12 w-12 mx-auto" /></div>
              <h3 className="text-xl font-bold text-gray-800">No products found</h3>
              <p className="text-gray-500">Try changing your filters or search keywords</p>
            </div>
          )}
        </div>

        {/* Pagination - Simplified */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="rounded-full h-10 w-10 p-0 border-gray-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <span className="text-sm font-medium px-4">Page {page} of {totalPages}</span>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="rounded-full h-10 w-10 p-0 border-gray-200"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919994999999" // Replace with actual number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.402 0 6.556-5.332 11.891-11.891 11.891-2.016 0-3.991-.512-5.747-1.487l-6.049 1.586zm5.839-3.411c1.554.914 3.097 1.383 4.605 1.383 5.461 0 9.904-4.444 9.904-9.905 0-2.639-1.026-5.123-2.894-6.992-1.866-1.868-4.351-2.895-6.99-2.895-5.467 0-9.911 4.444-9.911 9.905 0 1.748.461 3.42 1.332 4.887l-1.054 3.847 4.008-1.05zm10.596-7.513c-.313-.156-1.854-.915-2.145-1.018-.291-.102-.503-.153-.715.156-.213.311-.82 1.018-1.004 1.222-.185.204-.37.228-.684.072-.313-.156-1.323-.488-2.52-1.555-.931-.83-1.558-1.855-1.742-2.167-.184-.313-.02-.482.137-.638.141-.141.313-.365.469-.547.156-.182.209-.313.313-.522.104-.208.052-.39-.026-.547-.078-.157-.715-1.716-.979-2.352-.257-.619-.519-.533-.715-.543-.184-.009-.396-.011-.611-.011-.215 0-.568.081-.864.406-.297.325-1.133 1.106-1.133 2.693 0 1.587 1.156 3.118 1.316 3.328.16.21 2.274 3.472 5.508 4.868.769.331 1.368.528 1.837.677.77.244 1.472.21 2.025.128.618-.092 1.854-.758 2.118-1.468.264-.71.264-1.32.185-1.448-.078-.127-.291-.204-.604-.36z" /></svg>
      </a>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
