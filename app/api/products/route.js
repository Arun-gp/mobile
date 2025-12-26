import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET() {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      // Calculate total stock from sizes if available
      let totalStock = Number(data.stock) || 0;
      if (data.sizes) {
        totalStock = Object.values(data.sizes).reduce((acc, size) => acc + (Number(size.stock) || 0), 0);
      }

      return {
        _id: doc.id,
        name: String(data.name || "Unnamed Product"),
        description: String(data.description || ""),
        price: Number(data.price) || 0,
        category: String(data.category || "General"),
        image: Array.isArray(data.image) ? data.image[0] : (data.image || ""),
        stock: totalStock,
        discountPercentage: Number(data.discountPercentage) || 0,
        sizes: data.sizes || {}
      };
    });

    console.log(`API Products: Returning ${products.length} products`);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products API:", error);
    return NextResponse.json({ message: "Unable to fetch products", error: error.message }, { status: 500 });
  }
}
