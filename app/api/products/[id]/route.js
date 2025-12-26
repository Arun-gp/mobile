import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const data = productSnap.data();

        // Calculate total stock from sizes if available
        let totalStock = data.stock || 0;
        if (data.sizes) {
            totalStock = Object.values(data.sizes).reduce((acc, size) => acc + (size.stock || 0), 0);
        }

        // Standardize product object with robust fallbacks
        const product = {
            _id: productSnap.id,
            name: data.name || "Unnamed Product",
            description: data.description || "No description available",
            price: parseFloat(data.price) || 0,
            discountPercentage: parseFloat(data.discountPercentage) || 0,
            category: data.category || "General",
            image: Array.isArray(data.image) ? data.image : (data.image ? [data.image] : []),
            sizes: data.sizes || {
                XS: { stock: 0, price: parseFloat(data.price) || 0 },
                S: { stock: 0, price: parseFloat(data.price) || 0 },
                M: { stock: 0, price: parseFloat(data.price) || 0 },
                L: { stock: 0, price: parseFloat(data.price) || 0 },
                XL: { stock: 0, price: parseFloat(data.price) || 0 },
                XXL: { stock: 0, price: parseFloat(data.price) || 0 },
            },
            details: data.details || { material: "N/A" },
            stock: totalStock
        };

        return NextResponse.json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return NextResponse.json({ success: false, message: "Unable to fetch product detail", error: error.message }, { status: 500 });
    }
}
