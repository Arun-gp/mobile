"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from 'next/navigation';
import { CartContext } from "@/context/CartContext";
import { Search, Laptop, Smartphone, Apple, MonitorSmartphone, Heart } from "lucide-react";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  category: string;
  categoryType: string;
  originalPrice: number;
  price: number;
  discount: number;
  image: string;
  rating: number;
  inStock: boolean;
}

// Sample products for each category
export const allProducts: Product[] = [
  // Laptop Spare Parts
  {
    id: 1,
    name: "15V Adapter Charger",
    category: "Laptop Spare Parts, Laptop Adapter, Microsoft Surface Adapter",
    categoryType: "laptop",
    originalPrice: 11999,
    price: 2449,
    discount: 80,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766842572/zbq4bqszfgpocgxsvvn7.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 2,
    name: "18W Power Adapter",
    category: "Laptop Spare Parts, Laptop Adapter, Samsung Laptop Adapter",
    categoryType: "laptop",
    originalPrice: 2500,
    price: 1299,
    discount: 48,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766842666/klemoyhruxmgsuglkrvd.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 3,
    name: "19v 3.42a 65w Laptop Adapter",
    category: "Laptop Adapter, Acer Laptop Adapter, Laptop Spare Parts",
    categoryType: "laptop",
    originalPrice: 2200,
    price: 1199,
    discount: 46,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766842773/nyehlf0ez4gbww1obbas.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 4,
    name: "1TB Seagate",
    category: "Laptop Spare Parts, Laptop Hard Drive",
    categoryType: "laptop",
    originalPrice: 10000,
    price: 5499,
    discount: 45,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766842954/qcxjdfl1r288rua3xz7l.jpg",
    rating: 5,
    inStock: true,
  },
  // Mobile Spare Parts
  {
    id: 5,
    name: "Mobile Display Screen",
    category: "Mobile Spare Parts, LCD Display, Touch Screen",
    categoryType: "mobile",
    originalPrice: 3500,
    price: 1799,
    discount: 49,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844080/a0mt2v0w3eqmzpek93cv.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 6,
    name: "Mobile Battery 4000mAh",
    category: "Mobile Spare Parts, Replacement Battery",
    categoryType: "mobile",
    originalPrice: 1200,
    price: 599,
    discount: 50,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766843326/nhk88vymyn8cdh362fht.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 7,
    name: "Charging Port Flex Cable",
    category: "Mobile Spare Parts, Charging Port, Flex Cable",
    categoryType: "mobile",
    originalPrice: 800,
    price: 399,
    discount: 50,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766843391/rddyxnkptewxlcfvmecm.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 8,
    name: "Mobile Speaker Set",
    category: "Mobile Spare Parts, Speaker, Audio Components",
    categoryType: "mobile",
    originalPrice: 600,
    price: 299,
    discount: 50,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766843476/h2iaqxdlbnksquniicjb.jpg",
    rating: 5,
    inStock: true,
  },
  // iPhone Spare Parts
  {
    id: 9,
    name: "iPhone 13 Display",
    category: "iPhone Spare Parts, iPhone Display, OLED Screen",
    categoryType: "iphone",
    originalPrice: 15000,
    price: 8999,
    discount: 40,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766843542/mdwyg6tznktxmilqq6ix.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 10,
    name: "iPhone Battery",
    category: "iPhone Spare Parts, Original Battery",
    categoryType: "iphone",
    originalPrice: 3500,
    price: 1999,
    discount: 43,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844241/oewmiqc70lqfgjoiqyvk.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 11,
    name: "iPhone Charging Flex",
    category: "iPhone Spare Parts, Lightning Port, Charging Flex",
    categoryType: "iphone",
    originalPrice: 2000,
    price: 1199,
    discount: 40,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844316/gc3icuac3cvkhcky4ayb.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 12,
    name: "iPhone Camera Module",
    category: "iPhone Spare Parts, Front & Rear Camera",
    categoryType: "iphone",
    originalPrice: 5000,
    price: 2999,
    discount: 40,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844393/syuqcxgkvwxkncdgdg2a.jpg",
    rating: 5,
    inStock: true,
  },
  // Mac Spare Parts
  {
    id: 13,
    name: "MacBook Display",
    category: "Mac Spare Parts, Retina Display, LCD Screen",
    categoryType: "mac",
    originalPrice: 35000,
    price: 21999,
    discount: 37,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844526/b6gtezhchabhh8ougju5.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 14,
    name: "MacBook Battery",
    category: "Mac Spare Parts, Original Battery, A1502",
    categoryType: "mac",
    originalPrice: 8000,
    price: 4999,
    discount: 38,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844575/dl2lqtzsjhjnoxgbsn6v.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 15,
    name: "MacBook Trackpad",
    category: "Mac Spare Parts, Trackpad, Force Touch",
    categoryType: "mac",
    originalPrice: 6000,
    price: 3799,
    discount: 37,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844823/fhs8vktltbumxbpgxuem.jpg",
    rating: 5,
    inStock: true,
  },
  {
    id: 16,
    name: "MacBook Keyboard",
    category: "Mac Spare Parts, Keyboard, Replacement",
    categoryType: "mac",
    originalPrice: 12000,
    price: 7499,
    discount: 38,
    image: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766844823/fhs8vktltbumxbpgxuem.jpg",
    rating: 5,
    inStock: true,
  },
];

export default function SparePartsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const searchParams = useSearchParams();

  // set selectedCategory from query param when present
  useEffect(() => {
    try {
      const cat = searchParams?.get?.('category') || null;
      setSelectedCategory(cat);
    } catch (e) {
      // ignore
    }
  }, [searchParams]);

  // Load liked products from localStorage on mount and sync with wishlistItems
  useEffect(() => {
    try {
      // First, try to sync from wishlistItems (source of truth from wishlist page)
      const wishlistRaw = localStorage.getItem("wishlistItems");
      if (wishlistRaw) {
        const wishlistItems = JSON.parse(wishlistRaw) as Array<{ productId: string }>;
        const productIds = wishlistItems.map(item => parseInt(item.productId)).filter(id => !isNaN(id));
        setLikedProducts(productIds);
        // Update likedProducts to match
        localStorage.setItem("likedProducts", JSON.stringify(productIds));
      } else {
        // Fallback to likedProducts if wishlistItems doesn't exist
        const raw = localStorage.getItem("likedProducts");
        if (raw) {
          const arr = JSON.parse(raw) as number[];
          setLikedProducts(Array.isArray(arr) ? arr : []);
        }
      }
    } catch (e) {
      console.error("Failed to load liked products:", e);
    }
  }, []);

  // Listen for wishlist updates (e.g., when items are removed from wishlist page)
  useEffect(() => {
    const handleWishlistUpdate = () => {
      try {
        const wishlistRaw = localStorage.getItem("wishlistItems");
        if (wishlistRaw) {
          const wishlistItems = JSON.parse(wishlistRaw) as Array<{ productId: string }>;
          const productIds = wishlistItems.map(item => parseInt(item.productId)).filter(id => !isNaN(id));
          setLikedProducts(productIds);
          localStorage.setItem("likedProducts", JSON.stringify(productIds));
        } else {
          // If wishlistItems is empty, clear likedProducts
          setLikedProducts([]);
          localStorage.setItem("likedProducts", JSON.stringify([]));
        }
      } catch (e) {
        console.error("Failed to sync wishlist:", e);
      }
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("storage", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, []);

  // Persist liked products to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    } catch (e) {
      console.error("Failed to save liked products:", e);
    }
  }, [likedProducts]);

  // Sync likedProducts -> wishlistItems in localStorage and notify header.
  useEffect(() => {
    try {
      const mapped = likedProducts.map(id => {
        const p = allProducts.find(x => x.id === id);
        if (!p) return null;
        return {
          id: `local-${p.id}`,
          productId: String(p.id),
          name: p.name,
          price: p.price,
          image: p.image,
        } as { id: string; productId: string; name: string; price: number; image: string };
      }).filter((x): x is { id: string; productId: string; name: string; price: number; image: string } => x !== null);

      // dedupe by productId
      const map = new Map();
      for (const it of mapped) map.set(String(it.productId), it);
      const deduped = Array.from(map.values());
      localStorage.setItem("wishlistItems", JSON.stringify(deduped));
    } catch (e) {
      console.error('Failed to sync wishlistItems', e);
    }

    // dispatch async event so Header updates outside render
    try {
      setTimeout(() => { window.dispatchEvent(new Event('wishlistUpdated')); }, 0);
    } catch (e) { }
  }, [likedProducts]);

  const toggleLike = (product: Product) => {
    const exists = likedProducts.includes(product.id);

    if (exists) {
      setLikedProducts((prev) => prev.filter((x) => x !== product.id));
      toast.info("Removed from Wishlist");
    } else {
      setLikedProducts((prev) => [...prev, product.id]);
      toast.success("Added to Wishlist");
    }
  };

  // use CartContext if available so header/cart updates correctly
  const { addToCart: addToCartCtx } = useContext(CartContext) || {};
  const addToCart = (product: Product) => {
    if (typeof addToCartCtx === "function") {
      addToCartCtx(product, null);
    } else {
      // Fallback: store in localStorage cart_guest
      try {
        const key = `cart_guest`;
        const raw = localStorage.getItem(key) || "[]";
        const arr = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
        const existing = arr.find((i: any) => String(i.productId || i.id) === String(product.id));
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else arr.push({ id: product.id, productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
        localStorage.setItem(key, JSON.stringify(arr));
      } catch (e) {
        console.error("cart fallback error", e);
      }
    }

    console.log("Added to cart:", product.name);
  };

  // Filter products based on selected category AND search query
  let filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === null || product.categoryType === selectedCategory;
    const searchMatch = searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Apply sorting
  if (sortBy === "price-asc") {
    filteredProducts = filteredProducts.slice().sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts = filteredProducts.slice().sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-1 tracking-tight">Products</h1>
            <p className="text-gray-600 text-sm">Browse our collection of genuine spare parts</p>
          </div>

          {/* Minimal Sort / Filter UI */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white"
            >
              <option value="default">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-[#048567]" />
              <input
                placeholder="Search spare parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl bg-white focus:border-[#048567] focus:outline-none transition-all text-base shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === null
                ? "bg-[#048567] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory("laptop")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${selectedCategory === "laptop"
                ? "bg-[#048567] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
            >
              <Laptop className="w-4 h-4" />
              Laptop Spare Parts
            </button>
            <button
              onClick={() => setSelectedCategory("mobile")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${selectedCategory === "mobile"
                ? "bg-[#048567] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile Spare Parts
            </button>
            <button
              onClick={() => setSelectedCategory("iphone")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${selectedCategory === "iphone"
                ? "bg-[#048567] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
            >
              <Apple className="w-4 h-4" />
              iPhone Spare Parts
            </button>
            <button
              onClick={() => setSelectedCategory("mac")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${selectedCategory === "mac"
                ? "bg-[#048567] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
            >
              <MonitorSmartphone className="w-4 h-4" />
              Mac Spare Parts
            </button>
          </div>
        </div>

        {/* Search Results Count */}
        {searchQuery.trim() !== "" && (
          <div className="mb-4 text-center">
            <p className="text-gray-600">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Featured Products Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">
            {searchQuery.trim() !== "" ? "Search Results" : "Featured Products"}
          </h2>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">
                {searchQuery.trim() !== ""
                  ? `No products match your search for "${searchQuery}". Try a different term.`
                  : "No products available in this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  {/* Product Image (no overlay) */}
                  <div className="h-48 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 p-4"
                      />
                    ) : null}
                  </div>

                  {/* Product Info - Like button placed here so it doesn't overlap the image */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.category}</p>
                      </div>

                      <div className="flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLike(product);
                          }}
                          aria-label={likedProducts.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          className="flex items-center justify-center w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                        >
                          <Heart
                            className={`w-5 h-5 transition-all duration-200 ${likedProducts.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
                              }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-500 text-sm line-through">₹{product.originalPrice.toLocaleString()}</div>
                        <div className="text-lg md:text-xl font-extrabold text-gray-900">₹{product.price.toLocaleString()}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-[#048567] text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#036e56] transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => alert(`Viewing ${product.name}`)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Banner removed per request */}
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