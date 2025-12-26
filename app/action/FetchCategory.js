"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function fetchCategories() {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    // Group products by category
    const categoryMap = new Map();

    snapshot.docs.forEach(doc => {
      const product = doc.data();
      const category = product.category;

      if (category) {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category: category,
            images: [],
          });
        }

        // Collect images for this category
        if (product.image) {
          const existingData = categoryMap.get(category);
          const imageToAdd = Array.isArray(product.image) ? product.image[0] : product.image;
          if (imageToAdd && !existingData.images.includes(imageToAdd)) {
            existingData.images.push(imageToAdd);
          }
        }
      }
    });

    // Convert to array and format
    return Array.from(categoryMap.values()).map(cat => ({
      category: cat.category,
      image: cat.images.length > 0 ? cat.images[0] : "/about-mission.jpg",
      images: cat.images.length > 0 ? cat.images : ["/about-mission.jpg"],
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return default categories on error
    return [
      { category: "Gown", image: "/about-mission.jpg" },
      { category: "Chudithars", image: "/about-mission.jpg" },
      { category: "Shawl", image: "/about-mission.jpg" },
      { category: "Night Dress", image: "/about-mission.jpg" },
      { category: "Leggins", image: "/about-mission.jpg" },
    ];
  }
}
