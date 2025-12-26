import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";

export async function GET() {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("name", "asc"));
        const snapshot = await getDocs(q);

        const users = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users API:", error);
        return NextResponse.json({ message: "Unable to fetch users", error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { userId, role } = await req.json();
        if (!userId || !role) {
            return NextResponse.json({ success: false, message: "Missing userId or role" }, { status: 400 });
        }

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role });

        return NextResponse.json({ success: true, message: "User role updated successfully!" });
    } catch (error) {
        console.error("Error updating user role API:", error);
        return NextResponse.json({ success: false, message: "Error updating user role" }, { status: 500 });
    }
}
