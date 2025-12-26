"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserLogout } from "@/app/action/loginAction";
import Link from "next/link";
import Image from "next/image";
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
  ChevronDown,
  Search
} from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useContext(CartContext);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Use state for user data to ensure proper re-rendering
  const [user, setUser] = useState({
    isLoggedIn: false,
    profilePicture: null,
    userRole: null,
    userName: null,
  });

  // Check localStorage for user data on mount and when pathname changes
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

    // Also listen for storage events (for cross-tab sync)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => {
    const selectedSizePrice = item.sizes?.[item.selectedSize]?.price || item.price || 0;
    const discountPrice = selectedSizePrice - (selectedSizePrice * ((item.discountPercentage || 0) / 100));
    return total + (discountPrice * item.quantity);
  }, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
      router.push(`/products?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <div className="w-full z-[60]">
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
                      <Link href="/profile" className="block px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-3">
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        My Profile
                      </Link>
                      <Link href="/YourOrder" className="block px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-3">
                        <Package className="w-4 h-4 text-gray-400" />
                        Your Orders
                      </Link>
                      {user.userRole === "admin" && (
                        <Link href="/admin/dashboard" className="block px-4 py-3 text-sm hover:bg-gray-100 font-bold text-purple-600 flex items-center gap-3">
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
                <Link href="/profile" className="flex flex-col items-center gap-1 relative text-center">
                  <Heart className="w-6 h-6" />
                  <span className="text-[10px] hidden sm:block uppercase font-bold tracking-tighter">Wishlist</span>
                </Link>

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
              <button type="submit" className="bg-[#0066cc] px-4">
                <Search className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </header>

        {/* Secondary Navigation Bar */}
        <nav className="hidden md:block bg-white border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center gap-8">
            <Link href="/products" className="flex items-center gap-2 font-black text-sm text-gray-800 hover:text-[#0066cc] transition-colors group">
              <Menu className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              SHOP BY CATEGORY
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-6">
              {[
                { href: "/", label: "HOME" },
                { href: "/products", label: "ALL PARTS" },
                { href: "/aboutus", label: "ABOUT US" },
                { href: "/contact", label: "CONTACT US" },
                { href: "/shipping", label: "TRACK ORDER" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest hover:text-[#0066cc] transition-colors ${pathname === link.href ? 'text-[#0066cc]' : 'text-gray-600'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
            <div className="p-4 bg-[#0066cc] text-white flex items-center justify-between">
              <span className="font-black text-lg tracking-tighter">MOBILE SPARE</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4">
              <div className="flex flex-col gap-1">
                {[
                  { href: "/", label: "HOME" },
                  { href: "/products", label: "ALL PARTS" },
                  { href: "/aboutus", label: "ABOUT US" },
                  { href: "/contact", label: "CONTACT US" },
                  { href: "/shipping", label: "TRACK ORDER" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold border-b border-gray-50 hover:bg-gray-50 transition-colors uppercase"
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