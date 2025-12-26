import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order: { id: orderSnap.id, ...orderSnap.data() } });
    } catch (error) {
        console.error("Error fetching order API:", error);
        return NextResponse.json({ success: false, message: "Error fetching order" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        await deleteDoc(orderRef);

        return NextResponse.json({ success: true, message: "Order deleted successfully!" });
    } catch (error) {
        console.error("Error deleting order API:", error);
        return NextResponse.json({ success: false, message: "Error deleting order" }, { status: 500 });
    }
}
