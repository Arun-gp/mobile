"use server";

import dbconnect from "@/db/dbconnect";
import Product from "@/model/ProductModel";

export async function fetchProducts() {
  try {
    await dbconnect();  // Ensure DB is connected

    // Fetch products from the database with lean() to return plain objects
    const products = await Product.find().lean();  // Use .lean() to get plain objects

    // Serialize the products into plain objects
    const serializedProducts = products.map((product) => {
      // Ensure product.image is an array, if not, make it one
      const images = Array.isArray(product.image) ? product.image : [product.image];

      // Convert image(s) from Buffer to string (assuming image is in Buffer format)
      const firstImage = images.length > 0 ? images[0].toString('base64') : null;  // Convert to string if it's a Buffer

      // Serialize the sizes, handling stock and price per size
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].reduce((acc, size) => {
        if (product.sizes && product.sizes[size]) {
          acc[size] = {
            stock: product.sizes[size].stock || 0,
            price: product.sizes[size].discountPrice || product.sizes[size].price || product.price, // Use discountPrice if available, fallback to price
          };
        } else {
          // If size is missing, ensure it gets a default value of stock 0 and price fallback
          acc[size] = {
            stock: 0,
            price: product.discountPrice || product.price,
          };
        }
        return acc;
      }, {});

      // Calculate total stock based on sizes
      const totalStock = Object.values(sizes).reduce((total, sizeData) => total + sizeData.stock, 0);

      // Return the fully serialized object, including the _id as string
      return {
        _id: product._id.toString(),  // Convert MongoDB ObjectId to string
        name: product.name,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        image: firstImage,  // Convert image to base64 string (Buffer to string)
        category: product.category,
        stock: totalStock,  // Store the total stock based on sizes
        sizes, // Include the sizes with stock and price for each size
      };
    });

    return serializedProducts;

  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error('Unable to fetch products');
  }
}