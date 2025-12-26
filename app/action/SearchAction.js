"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function SearchBar(
  searchQuery = "",
  category = "",
  page = 1,
  limit = 10,
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER
) {
  try {
    const productsRef = collection(db, "products");

    // Fetch all products first, then filter client-side
    // This avoids the Firestore composite index requirement
    // For production with large datasets, you should create the required index
    // or use a search service like Algolia
    const productsQuery = query(
      productsRef,
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(productsQuery);

    // Get all products
    const allProducts = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));

    // Apply filters client-side
    let filteredProducts = allProducts;

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === category
      );
    }

    // Filter by price range
    if (minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery)
      );
    }

    // Calculate total before pagination
    const totalProducts = filteredProducts.length;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    // Calculate price range from all products in the category (or all if no category)
    let priceRange = { min: 0, max: 10000 };
    const productsForPriceRange = category
      ? allProducts.filter(p => p.category === category)
      : allProducts;

    if (productsForPriceRange.length > 0) {
      const prices = productsForPriceRange.map(p => p.price || 0);
      priceRange = {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices))
      };
    }

    return {
      products: paginatedProducts.map((product) => ({
        _id: product._id,
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        discountPercentage: product.discountPercentage || 0,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        category: product.category || "",
        stock: product.stock || 0,
      })),
      totalProducts,
      priceRange,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty results instead of throwing
    return {
      products: [],
      totalProducts: 0,
      priceRange: { min: 0, max: 10000 },
    };
  }
}