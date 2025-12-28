"use client"; // Ensure this runs only on the client

import React, { createContext, useState, useEffect } from 'react';

// Create CartContext
const CartContext = createContext();

// CartProvider component to provide the cart state to other components
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get the userId from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('userId') || 'guest';
      setUserId(savedUserId);
    }
  }, []);

  // Load the saved cart from localStorage when userId is available
  useEffect(() => {
    if (userId && typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [userId]);

  // Get the price for a specific size
  const getPriceForSize = (product, size) => {
    return product?.sizes?.[size]?.price || product?.price || 0; // Fallback to base price if no specific size price is set
  };

  // Add product to the cart
  const addToCart = (product, size) => {
    // Normalize id (support product._id or product.id)
    const id = product._id || product.id || product._id === 0 ? product._id : product.id;
    const normalizedProduct = { ...product, _id: id };

    const productPrice = getPriceForSize(normalizedProduct, size);

    // Determine available stock gracefully
    const productStock = normalizedProduct?.sizes?.[size]?.stock ?? normalizedProduct?.stock ?? Infinity;

    const existingProduct = cart.find(item => item._id === normalizedProduct._id && item.selectedSize === size);

    if (existingProduct) {
      // If the product is already in the cart, increase its quantity if it's not out of stock
      if (existingProduct.quantity < productStock) {
        const updatedCart = cart.map(item => {
          if (item._id === normalizedProduct._id && item.selectedSize === size) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        setCart(updatedCart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      }
    } else {
      // Add the new product to the cart
      const updatedCart = [...cart, { ...normalizedProduct, selectedSize: size ?? null, quantity: 1, price: productPrice }];
      setCart(updatedCart);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
    }
  };

  // Remove product from the cart
  const removeFromCart = (productId, size) => {
    const updatedCart = cart.filter(item => !(item._id === productId && item.selectedSize === size));
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  // Increase product quantity in the cart
  const increaseQuantity = (productId, size, stock) => {
    const updatedCart = cart.map(item => {
      if (item._id === productId && item.selectedSize === size && item.quantity < stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  // Decrease product quantity in the cart
  const decreaseQuantity = (productId, size) => {
    const updatedCart = cart.map(item => {
      if (item._id === productId && item.selectedSize === size && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  // Update the size of the product in the cart
  const updateCartSize = (productId, newSize) => {
    const updatedCart = cart.map(item => {
      if (item._id === productId) {
        const newPrice = getPriceForSize(item, newSize); // Update price based on new size
        return { ...item, selectedSize: newSize, price: newPrice }; // Update the selected size and price
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      updateCartSize,
      updateCartSize,
      getPriceForSize, // Expose this function to get price for size
      clearCart: () => {
        setCart([]);
        if (userId) localStorage.removeItem(`cart_${userId}`);
      }
    }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
