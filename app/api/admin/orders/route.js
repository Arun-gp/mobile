import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const ordersRef = collection(db, "orders");
        let q = query(ordersRef, orderBy("createdAt", "desc"));

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            q = query(ordersRef,
                where("createdAt", ">=", Timestamp.fromDate(start)),
                where("createdAt", "<=", Timestamp.fromDate(end)),
                orderBy("createdAt", "desc")
            );
        }

        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                _id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate().toISOString() || null,
                updatedAt: data.updatedAt?.toDate().toISOString() || null,
            };
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders API:", error);
        return NextResponse.json({ message: "Unable to fetch orders", error: error.message }, { status: 500 });
    }
}
