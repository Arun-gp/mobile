"use server";
import AWS from 'aws-sdk';
import dbconnect from "@/db/dbconnect";
import Product from "@/model/ProductModel";
import { v4 as uuidv4 } from 'uuid'; // To generate unique file names for images

// Configure AWS S3
const s3 = new AWS.S3({
  region: "eu-north-1", // e.g., "us-east-1"
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set in your environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set in your environment variables
});

// Your S3 Bucket Name
const BUCKET_NAME = "ecommerece-aadhanaa";

// Function to handle editing a product
export async function editProduct(productId, formData) {
  try {
    await dbconnect(); // Connect to the database

    // Find the existing product by ID
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Extract data from the form (use existing values if not provided)
    const name = formData.get("name") || product.name;
    const description = formData.get("description") || product.description;
    const price = parseFloat(formData.get("price")) || product.price;
    const category = formData.get("category") || product.category;
    const stock = parseInt(formData.get("stock")) || product.stock;
    const discountPercentage = parseFloat(formData.get("discountPercentage")) || product.discountPercentage;

    // Handle size-specific stock and price (if provided)
    const sizes = {
      XS: {
        stock: parseInt(formData.get("size_XS_stock")) || product.sizes.XS.stock,
        price: parseFloat(formData.get("size_XS_price")) || product.sizes.XS.price || price,
      },
      S: {
        stock: parseInt(formData.get("size_S_stock")) || product.sizes.S.stock,
        price: parseFloat(formData.get("size_S_price")) || product.sizes.S.price || price,
      },
      M: {
        stock: parseInt(formData.get("size_M_stock")) || product.sizes.M.stock,
        price: parseFloat(formData.get("size_M_price")) || product.sizes.M.price || price,
      },
      L: {
        stock: parseInt(formData.get("size_L_stock")) || product.sizes.L.stock,
        price: parseFloat(formData.get("size_L_price")) || product.sizes.L.price || price,
      },
      XL: {
        stock: parseInt(formData.get("size_XL_stock")) || product.sizes.XL.stock,
        price: parseFloat(formData.get("size_XL_price")) || product.sizes.XL.price || price,
      },
      XXL: {
        stock: parseInt(formData.get("size_XXL_stock")) || product.sizes.XXL.stock,
        price: parseFloat(formData.get("size_XXL_price")) || product.sizes.XXL.price || price,
      },
    };

    // Handle new images (if provided)
    const imageFiles = formData.getAll("image");
    let imageUrls = product.image || []; // Default to existing images

    if (imageFiles.length > 0) {
      // Function to upload a file to S3
      async function uploadToS3(file) {
        const fileName = `${uuidv4()}-${file.name}`;
        const buffer = await file.arrayBuffer(); // Convert file to buffer

        const params = {
          Bucket: BUCKET_NAME,
          Key: fileName, // File name in S3
          Body: Buffer.from(buffer), // File content
          ContentType: file.type, // MIME type
        };

        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location; // URL of the uploaded file
      }

      // Remove old images (if necessary)
      for (let oldImageUrl of product.image) {
        const fileKey = oldImageUrl.split('/').pop(); // Extract the file key from the URL
        const deleteParams = { Bucket: BUCKET_NAME, Key: fileKey };
        await s3.deleteObject(deleteParams).promise(); // Delete the old image from S3
      }

      // Clear the existing image URLs and upload new images
      imageUrls = [];
      for (let imageFile of imageFiles) {
        const imageUrl = await uploadToS3(imageFile);
        imageUrls.push(imageUrl);
      }
    }

    // Update the product with the new data
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;
    product.discountPercentage = discountPercentage;
    product.sizes = sizes; // Update size-specific data
    product.image = imageUrls; // Update the image URLs

    // Save the updated product to the database
    await product.save();

    return { success: true, message: "Product updated successfully!" };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: "Failed to update product" };
  }
}
