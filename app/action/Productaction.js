"use server";

import dbconnect from "@/db/dbconnect";
import Product from "@/model/ProductModel";

export default async function fetchProduct(id) {
  try {
    await dbconnect(); // Ensure DB is connected

    // Fetch the product by ID
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    // Ensure the image field is always an array of URLs
    const images = Array.isArray(product.image)
      ? product.image
      : product.image
      ? [product.image]
      : []; // Fallback to an empty array if no images exist

    // Serialize the product data
    const serializedProduct = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.discountPrice || product.price,
      discountPercentage: product.discountPercentage,
      image: images, // Array of image URLs
      category: product.category,
      stock: product.stock,
      sizes: {
        XS: {
          stock: product.sizes?.XS?.stock || 0,
          price:
            product.sizes?.XS?.discountPrice ||
            product.sizes?.XS?.price ||
            product.discountPrice ||
            product.price,
        },
        S: {
          stock: product.sizes?.S?.stock || 0,
          price:
            product.sizes?.S?.discountPrice ||
            product.sizes?.S?.price ||
            product.discountPrice ||
            product.price,
        },
        M: {
          stock: product.sizes?.M?.stock || 0,
          price:
            product.sizes?.M?.discountPrice ||
            product.sizes?.M?.price ||
            product.discountPrice ||
            product.price,
        },
        L: {
          stock: product.sizes?.L?.stock || 0,
          price:
            product.sizes?.L?.discountPrice ||
            product.sizes?.L?.price ||
            product.discountPrice ||
            product.price,
        },
        XL: {
          stock: product.sizes?.XL?.stock || 0,
          price:
            product.sizes?.XL?.discountPrice ||
            product.sizes?.XL?.price ||
            product.discountPrice ||
            product.price,
        },
        XXL: {
          stock: product.sizes?.XXL?.stock || 0,
          price:
            product.sizes?.XXL?.discountPrice ||
            product.sizes?.XXL?.price ||
            product.discountPrice ||
            product.price,
        },
        
      },
      details: {
        material: product.details?.material,
        
        specifications: {
          fabric: product.details?.specifications?.fabric,
          pattern: product.details?.specifications?.pattern,
          fit: product.details?.specifications?.fit,
          occasion: product.details?.specifications?.occasion,
          neckline: product.details?.specifications?.neckline,
          sleeve: product.details?.specifications?.sleeve,
          length: product.details?.specifications?.length,
        },
    },
  };
    // Example usage: Accessing images
    if (serializedProduct.image && serializedProduct.image.length > 0) {
      console.log("First image URL:", serializedProduct.image[0]); // Access the first image

      serializedProduct.image.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, img); // Log all images
      });
    } else {
      console.log("No images available");
    }

    return serializedProduct;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Unable to fetch product");
  }
}
