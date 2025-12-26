
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Helper to get user ID from request (assuming you might pass it via headers or verify token)
// For now, since we use client-side auth for Firebase, the client usually interacts with Firestore directly for reading/writing their own data (with security rules).
// BUT, the user asked to "change everything to API". So we will wrap Firestore calls in this API route.

export async function POST(request) {
    try {
        const { userId, productId, productData } = await request.json();

        if (!userId || !productId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if item already exists
        const q = query(
            collection(db, "wishlist"),
            where("userId", "==", userId),
            where("productId", "==", productId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return NextResponse.json({ message: "Item already in wishlist" }, { status: 200 });
        }

        // Add to wishlist
        const docRef = await addDoc(collection(db, "wishlist"), {
            userId,
            productId,
            ...productData,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ id: docRef.id, message: "Added to wishlist" }, { status: 201 });

    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const q = query(collection(db, "wishlist"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const wishlist = [];
        querySnapshot.forEach((doc) => {
            wishlist.push({ id: doc.id, ...doc.data() });
        });

        return NextResponse.json(wishlist);

    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Wishlist Item ID required" }, { status: 400 });
        }

        await deleteDoc(doc(db, "wishlist", id));
        return NextResponse.json({ message: "Removed from wishlist" });
    } catch (error) {
        console.error("Error deleting wishlist item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
