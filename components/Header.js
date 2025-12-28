"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserLogout } from "@/app/action/loginAction";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  User,
  ShoppingCart,
  LogOut,
  UserCircle,
  LayoutDashboard,
  Menu,
  X,
  Package,
  Heart,
  Smartphone,
  Search
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { allProducts } from "@/app/products/ProductsList";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useContext(CartContext);
  const dropdownRef = useRef(null);
  const [wishlist, setWishlist] = useState([]);
  const wishlistRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // derive categories and subitems from allProducts
  const categories = (() => {
    const map = new Map();
    for (const p of allProducts || []) {
      const main = p.categoryType || 'other';
      if (!map.has(main)) map.set(main, new Set());
      const parts = (p.category || '').split(',').map(s => s.trim()).filter(Boolean);
      for (const part of parts) {
        // skip the main label if it matches
        map.get(main).add(part);
      }
    }
    // convert to array of { key, label, subs }
    return Array.from(map.entries()).map(([key, set]) => ({ key, subs: Array.from(set) }));
  })();

  const labelFor = (key) => {
    switch (key) {
      case 'laptop': return 'Laptop Spare Parts';
      case 'mobile': return 'Mobile Spare Parts';
      case 'iphone': return 'iPhone Spare Parts';
      case 'mac': return 'Mac Spare Parts';
      default: return key;
    }
  };

  // map category keys to the simple monochrome SVG icons in /public/icons
  const iconFor = (key) => {
    switch (key) {
      case 'laptop': return '/icons/laptop.svg';
      case 'mobile': return '/icons/mobile.svg';
      case 'iphone': return '/icons/iphone.svg';
      case 'mac': return '/icons/macbook.svg';
      default: return '/icons/laptop.svg';
    }
  };

  const [user, setUser] = useState({
    isLoggedIn: false,
    profilePicture: null,
    userRole: null,
    userName: null,
  });

  // Check auth on mount and pathname change
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        setUser({
          isLoggedIn: !!token,
          profilePicture: localStorage.getItem("profilePicture"),
          userRole: localStorage.getItem("userRole"),
          userName: localStorage.getItem("userName"),
        });
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]);

  // Auto-close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownVisible(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Load wishlist items from localStorage and listen for changes
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const raw = localStorage.getItem("wishlistItems") || "[]";
        const parsed = JSON.parse(raw);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setWishlist([]);
      }
    };

    loadWishlist();
    window.addEventListener("storage", loadWishlist);
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => {
      window.removeEventListener("storage", loadWishlist);
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => {
    const selectedSizePrice = item.sizes?.[item.selectedSize]?.price || item.price || 0;
    const discountPrice = selectedSizePrice - (selectedSizePrice * ((item.discountPercentage || 0) / 100));
    return total + (discountPrice * item.quantity);
  }, 0);

  const logout = async () => {
    const result = await UserLogout();
    if (result.success) {
      localStorage.clear();
      setUser({
        isLoggedIn: false,
        profilePicture: null,
        userRole: null,
        userName: null,
      });
      router.push("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/SearchFilter?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Navigation links - FIXED: Using correct property names matching your folder structure
  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/products", label: "ALL PARTS" },
    { href: "/about-us", label: "ABOUT US" },
    { href: "/contact", label: "CONTACT US" },
    { href: "/track-order", label: "TRACK ORDER" },
  ];

  return (
    <>
      <div className="w-full relative z-[60]">
        {/* Top Marquee Bar */}
        <div className="bg-[#ff6600] text-white py-1.5 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block text-xs font-bold tracking-wider">
            ⚡ Quality Mobile Spare Parts | Fast Delivery | Genuine Products | Bulk Orders Welcome ⚡ &nbsp;&nbsp;&nbsp;
            ⚡ Quality Mobile Spare Parts | Fast Delivery | Genuine Products | Bulk Orders Welcome ⚡
          </div>
        </div>

        {/* Main Header */}
        <header className="bg-[#0066cc] text-white shadow-md">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4 md:gap-8">

              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                <Smartphone className="w-8 h-8 text-white" />
                <span className="text-xl font-black tracking-tight">MOBILE SPARE</span>
              </Link>

              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl bg-white rounded overflow-hidden">
                <div className="flex-grow flex items-center">
                  <input
                    type="text"
                    placeholder="Search for spare parts..."
                    className="w-full px-4 py-2.5 text-black text-sm focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-[#0066cc] px-6 border-l border-white/20 hover:bg-[#0052a3] transition-colors">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </form>

              {/* Actions */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Account */}
                <div className="relative group" ref={dropdownRef}>
                  {user.isLoggedIn ? (
                    <button
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <User className="w-6 h-6" />
                      <span className="text-[10px] hidden sm:block uppercase font-bold tracking-tighter">Account</span>
                    </button>
                  ) : (
                    <Link href="/login" className="flex flex-col items-center gap-1 text-center">
                      <User className="w-6 h-6 text-white" />
                      <span className="text-[10px] hidden sm:block uppercase font-bold tracking-tighter">Login</span>
                    </Link>
                  )}

                  {dropdownVisible && user.isLoggedIn && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white text-black shadow-2xl rounded-xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 z-[70]">
                      <div className="px-4 py-2 border-b mb-1">
                        <p className="font-bold text-sm truncate">{user.userName}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{user.userRole}</p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => setDropdownVisible(false)}
                      >
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        My Profile
                      </Link>
                      <Link 
                        href="/your-orders" 
                        className="px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => setDropdownVisible(false)}
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        Your Orders
                      </Link>
                      {user.userRole === "admin" && (
                        <Link 
                          href="/admin/dashboard" 
                          className="px-4 py-3 text-sm hover:bg-gray-100 font-bold text-purple-600 flex items-center gap-3"
                          onClick={() => setDropdownVisible(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={logout} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 border-t mt-1 flex items-center gap-3">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <div className="relative group" ref={wishlistRef}>
                  <Link href="/wishlist" className="flex flex-col items-center gap-1 relative text-center">
                    <div className="relative">
                      <Heart className="w-6 h-6" />
                      {wishlist.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-white text-[#0066cc] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg border border-[#0066cc]/10">
                          {wishlist.length}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] hidden sm:block uppercase font-bold tracking-tighter">Wishlist</span>
                  </Link>

                  {/* Hover preview dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white text-black shadow-2xl rounded-xl py-2 border border-gray-100 hidden group-hover:block z-50">
                    {wishlist.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">No items in wishlist</p>
                    ) : (
                      <div className="max-h-56 overflow-auto">
                        {wishlist.map((it, idx) => (
                          <Link
                            key={it.productId || idx}
                            href="/wishlist"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                          >
                            <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded" />
                            <div className="flex-1">
                              <div className="text-sm font-bold truncate">{it.name}</div>
                              <div className="text-xs text-gray-500">₹{Number(it.price).toLocaleString()}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cart */}
                <Link href="/cart" className="flex items-center gap-2 group text-center">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-[#0066cc] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg border border-[#0066cc]/10">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase font-bold tracking-tighter">My Cart</span>
                    <span className="text-xs font-bold mt-1 tracking-tight">₹{cartTotalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden flex items-center justify-center p-1"
                  aria-label="Open menu"
                >
                  <Menu className="w-7 h-7" />
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex md:hidden mt-3 bg-white rounded overflow-hidden">
              <input
                type="text"
                placeholder="Search spare parts..."
                className="w-full px-4 py-1.5 text-black text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-[#0066cc] px-4" aria-label="Search">
                <Search className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </header>

        {/* Secondary Navigation Bar */}
        <nav className="hidden md:block bg-white border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center gap-8">
            <button
              onClick={(e) => { e.preventDefault(); setSidebarOpen(true); setActiveCategory(null); }}
              className="flex items-center gap-2 font-black text-sm text-white bg-[#0066cc] px-3 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="Shop by category"
            >
              <Menu className="w-4 h-4" />
              <span className="tracking-tight">SHOP BY CATEGORY</span>
            </button>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest hover:text-[#0066cc] transition-colors ${
                    pathname === link.href ? 'text-[#0066cc]' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

      {/* Category Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[120] flex">
          <div className="w-96 bg-white rounded-l-3xl border-r border-gray-100 shadow-lg overflow-hidden">
            <div className="bg-[#0066cc] text-white rounded-t-3xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5" />
                <span className="font-black text-sm tracking-tight">SHOP BY CATEGORY</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close" className="p-2 rounded hover:bg-white/10 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto" onMouseLeave={() => setActiveCategory(null)}>
              <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat.key}>
                      <button
                        onMouseEnter={() => setActiveCategory(cat.key)}
                        onFocus={() => setActiveCategory(cat.key)}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 flex items-center gap-3 text-gray-600 hover:text-[#0066cc] ${activeCategory === cat.key ? 'bg-gray-100 font-bold text-[#0066cc]' : 'hover:bg-gray-50'}`}
                      >
                        <img src={iconFor(cat.key)} alt={labelFor(cat.key)} className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{labelFor(cat.key)}</span>
                        <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`col-span-1 border-l pl-4 transition-all duration-200 ${activeCategory ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}>
                {activeCategory && (
                  <div className="bg-white">
                    <h4 className="font-black mb-2">Related Parts</h4>
                    <ul className="space-y-2 text-sm">
                      {(categories.find(c => c.key === activeCategory)?.subs || []).map(sub => (
                        <li key={sub}>
                          <button
                            onClick={() => {
                              setSidebarOpen(false);
                              router.push(`/products?category=${encodeURIComponent(activeCategory)}&sub=${encodeURIComponent(sub)}`);
                            }}
                            className="w-full text-left px-2 py-1 rounded-md hover:bg-gray-50 transition-colors duration-150 text-gray-600 hover:text-[#0066cc] flex items-center justify-between"
                          >
                            <span>{sub}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>

          <div className="flex-1" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
            <div className="p-4 bg-[#0066cc] text-white flex items-center justify-between">
              <span className="font-black text-lg tracking-tighter">MOBILE SPARE</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-bold border-b border-gray-50 hover:bg-gray-50 transition-colors uppercase ${
                      pathname === link.href ? 'bg-blue-50 text-[#0066cc]' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex flex-col gap-4">
              {user.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">
                    {user.userName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold truncate">{user.userName}</p>
                    <button onClick={logout} className="text-xs text-red-600 font-bold uppercase">Logout</button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#0066cc] text-white text-center py-3 rounded font-bold uppercase"
                >
                  Log In / Sign Up
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          display: inline-block;
          padding-left: 50%;
        }
      `}</style>
    </>
  );
}