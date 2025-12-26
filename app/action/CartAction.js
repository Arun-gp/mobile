"use server";

import dbconnect from "@/db/dbconnect";
// Import necessary modules
import { verify } from "jose";  // jose is a library for JWT verification
  // Utility to connect to MongoDB

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET; // Secret key used to sign the JWT

// Server action to fetch the user's cart
export async function fetchUserCart(token) {
  try {
    // Verify the token and decode it
    const decoded = verify(token, JWT_SECRET);
    const userId = decoded.userId; // Extract userId from the decoded token

   
     await dbconnect();
    

    if (!cart) {
      return { cart: [] };  // Return an empty cart if no cart exists
    }

    return { cart: cart.items };  // Assuming 'items' is the cart array in the db
  } catch (error) {
    console.error("Error verifying token or fetching cart:", error);
    throw new Error("Failed to fetch cart");
  }
}
