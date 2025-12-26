"use server";

import AWS from "aws-sdk";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

// Configure AWS S3
const s3 = new AWS.S3({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = "ecommerece-aadhanaa";

export async function deleteProduct(productId) {
  try {
    // Get product from Firestore
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return { success: false, message: "Product not found in Firebase!" };
    }

    const productData = productSnap.data();

    // Delete images from S3
    if (productData.image && Array.isArray(productData.image)) {
      for (let imageUrl of productData.image) {
        try {
          const fileKey = imageUrl.split('/').pop();
          const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: fileKey,
          };
          await s3.deleteObject(deleteParams).promise();
          console.log(`Deleted image from S3: ${fileKey}`);
        } catch (s3Error) {
          console.error(`Failed to delete image from S3:`, s3Error);
        }
      }
    }

    // Delete from Firestore
    await deleteDoc(productRef);

    return { success: true, message: "Product deleted from Firebase successfully!" };
  } catch (error) {
    console.error("Error deleting product from Firebase:", error);
    return { success: false, message: "Failed to delete product from Firebase" };
  }
}
