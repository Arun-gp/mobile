"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserLogout } from "@/app/action/loginAction";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/outline";  // Import the UserIcon for login
import Image from "next/image"; // Import for next.js optimized images
import { CartContext } from "@/context/CartContext"; // Import CartContext

export function Header() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for category
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Access CartContext to get cart state and functions
  const { cart } = useContext(CartContext);

  // Checking for user authentication and profile details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const profilePic = localStorage.getItem("profilePicture");
      const role = localStorage.getItem("userRole");
      if (profilePic) {
        setProfilePicture(profilePic);
      }
      if (role) {
        setUserRole(role);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetching cart item count directly from the cart state
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0); // Count total items in cart

  // Handling search
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?query=${query}&category=${selectedCategory}`);
    }
  };

  // Handling category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    // Update the URL with the selected category
    router.push(`/products?query=${query}&category=${category}`);
  };

  // Toggle dropdown visibility
  const handleProfileClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handle logout
  const logout = async () => {
    const result = await UserLogout();
    if (result.success) {
      // Clear user session and redirect to login page
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("userRole");
      setIsLoggedIn(false);
      setDropdownVisible(false);
      setProfilePicture(null); // Reset profile picture
      setUserRole(""); // Reset user role
      router.push("/login"); // Redirect to login page
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      {/* Logo Section with Colorful Gradient Logo */}
      <div className="flex flex-col items-center sm:items-start space-y-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="50"
          height="50"
          className="h-12 w-12"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#FF7F50", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#6A5ACD", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#gradient1)" />
          <text
            x="50%"
            y="50%"
            fontSize="20"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
            dy=".3em"
          >
            Krish
          </text>
        </svg>
        <h2 className="text-xl font-bold text-white">Krish</h2>
      </div>

      {/* Header Items (Login/Signup/Profile/Cart) */}
      <div className="flex items-center space-x-4 sm:space-x-6 mt-4 sm:mt-0">
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <UserIcon className="w-5 h-5 mr-2" /> {/* Login icon */}
              Login
            </button>
          </>
        ) : (
          <>
            {/* Links for Profile, Products, and Chudithar */}
            <div className="hidden sm:flex items-center space-x-6">
              <Link href="/profile">
                <button className="text-white text-sm hover:text-blue-400 transition-all duration-200 ease-in-out">
                  Profile
                </button>
              </Link>
              <Link href="/products">
                <button className="text-white text-sm hover:text-blue-400 transition-all duration-200 ease-in-out">
                  Products
                </button>
              </Link>
              <Link href="/contact">
                <button className="text-white text-sm hover:text-blue-400 transition-all duration-200 ease-in-out">
                  Contact
                </button>
              </Link>
              <Link href="/aboutus">
                <button className="text-white text-sm hover:text-blue-400 transition-all duration-200 ease-in-out">
                  About
                </button>
              </Link>
            </div>

            {/* Profile Picture and Dropdown */}
            <div className="relative">
              <Image
                src={profilePicture || "/default-avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-white cursor-pointer"
                onClick={handleProfileClick}
              />
              {dropdownVisible && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50 ring-1 ring-gray-200 dark:ring-gray-700"
                >
                  <div className="flex flex-col p-2">
                    {/* Profile Link */}
                    <Link href="/profile" passHref>
                      <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors duration-200 rounded-md">
                        Profile
                      </button>
                    </Link>

                    {/* Products Link */}
                    <Link href="/products" passHref>
                      <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors duration-200 rounded-md">
                        Products
                      </button>
                    </Link>

                    {/* Your Order Link */}
                    <Link href="/YourOrder" passHref>
                      <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors duration-200 rounded-md">
                        Your Order
                      </button>
                    </Link>

                    {/* Admin Link (only for admin users) */}
                    {userRole === "admin" && (
                      <Link href="/admin/dashboard" passHref>
                        <button className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors duration-200 rounded-md">
                          Admin Dashboard
                        </button>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800 rounded-b-md transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon with count */}
            <div className="relative flex items-center">
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center -mt-1 -mr-1">
                  {cartItemCount}
                </span>
              )}
              <Link href="/cart" className="flex items-center">
                <ShoppingCartIcon className="w-8 h-8 text-white" />
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
