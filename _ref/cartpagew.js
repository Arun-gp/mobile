"use client";

import { CartContext } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const router = useRouter(); 
  const handleIncreaseQuantity = (productId, prodstock) => {
    increaseQuantity(productId, prodstock); // This function should update the cart in the context
  };

  const handleDecreaseQuantity = (productId) => {
    decreaseQuantity(productId); // This function should update the cart in the context
  };

  // Calculate total quantity of items in cart
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const handleCheckout = () => {
    // Check if the user is logged in by checking the token in localStorage
    const token = localStorage.getItem('token');  // or you can check cookies if that's where the token is stored

    if (token) {
      // If logged in, redirect to the shipping page
      router.push("/shipping");
    } else {
      // If not logged in, redirect to the login page with the redirect parameter
      router.push("/");
    }
  };
  return (
    <div className="cart mt-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart ({cart.length} items)</h2>

      {/* Cart Items List */}
      <ul className="space-y-6">
        {cart.map((item) => (
          <li key={item._id} className="flex items-center justify-between p-4 border-b-2 border-gray-200">
            <div className="flex items-center space-x-4">
              {/* Product Image */}
              <Image src={item.image} alt={item.name} width={75} height={75} className="rounded-md" />

              {/* Product Details */}
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-sm text-gray-700">${item.price}</p>
              </div>
            </div>

            {/* Quantity Controls and Remove Button */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Increase Quantity Button */}
                <button
                  onClick={() => handleIncreaseQuantity(item._id, item.stock)}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                >
                  +
                </button>

                {/* Decrease Quantity Button */}
                <button
                  onClick={() => handleDecreaseQuantity(item._id)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                >
                  -
                </button>
              </div>

              {/* Display Current Quantity */}
              <div className="text-sm text-gray-700">Qty: {item.quantity}</div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Cart Summary */}
      <div className="mt-6 space-y-4">
        <h3 className="font-semibold text-xl">Cart Summary</h3>
        <div className="flex justify-between">
          <p>Total Items:</p>
          <p>{cart.length}</p> {/* Number of unique products in the cart */}
        </div>
        <div className="flex justify-between">
          <p>Total Quantity:</p>
          <p>{totalQuantity}</p> {/* Total quantity of products in the cart */}
        </div>
        <div className="flex justify-between font-semibold">
          <p>Total Price:</p>
          <p>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button  onClick={handleCheckout}  className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors duration-200">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
 "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Using Next.js Router to handle URL navigation
import { UserLogout } from "@/app/action/loginAction";
import Link from "next/link";

export function Header() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State to hold cart item count
  const [profilePicture, setProfilePicture] = useState(null); // State to hold profile picture
  const router = useRouter();

  // Check if the user is logged in by looking for a token or session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Retrieve the profile picture URL from localStorage or API
      const profilePic = localStorage.getItem("profilePicture"); // Example: Fetch from localStorage
      if (profilePic) {
        setProfilePicture(profilePic); // Set the profile picture
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Check the cart item count when the component mounts (for specific userId)
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // Retrieve the user's cart from localStorage using the userId
      const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      setCartItemCount(userCart.length); // Set the cart count based on the length of the cart array
    }
  }, []); // This effect runs once when the component mounts

  // Handle search form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?query=${query}`); // Navigate to the products page with the query in the URL
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Save the image to localStorage as a base64 string
        localStorage.setItem("profilePicture", reader.result);
        setProfilePicture(reader.result); // Update the state with the new profile picture
      };
      reader.readAsDataURL(file); // Read the file as a base64 URL
    }
  };

  // Logout function that clears session and redirects user
  const logout = async () => {
    const result = await UserLogout();
    if (result.success) {
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="flex flex-grow justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-96 py-3 px-6 text-lg rounded-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {/* Buttons for Login, Signup, and Logout */}
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <>
            {/* Login Button */}
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </button>

            {/* Signup Button */}
            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Signup
            </button>
          </>
        ) : (
          <>
            {/* Logout Button */}
            <form action={logout}>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                LOGOUT
              </button>
            </form>

            {/* Profile Picture */}
            {profilePicture ? (
              <div className="flex flex-col items-center mt-2">
                <img
                  src={profilePicture}
                  alt="Profile Picture"
                  className="w-16 h-16 rounded-full border-2 border-white"
                />
              </div>
            ) : (
              <div className="flex items-center mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                />
                <span className="ml-2 text-sm text-gray-400">Upload Profile Picture</span>
              </div>
            )}

            {/* Cart Link */}
            <Link href="/cart" className="flex items-center mt-2">
              <span className="mr-2">View Cart</span>
              {/* Show the number of items in the cart */}
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
