import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const ordersRef = collection(db, 'orders');
        let snapshot;

        try {
            // Priority 1: Ordered by date (Requires index)
            const q = query(
                ordersRef,
                where('user', '==', userId),
                orderBy('createdAt', 'desc')
            );
            snapshot = await getDocs(q);
        } catch (queryError) {
            console.warn(`[ORDERS_API] Ordered query failed for user ${userId}. Falling back to unordered fetch. Error: ${queryError.message}`);

            try {
                // Priority 2: Filter by user only (Unordered, safe)
                const fallbackQuery = query(
                    ordersRef,
                    where('user', '==', userId)
                );
                snapshot = await getDocs(fallbackQuery);
            } catch (fallbackError) {
                console.error(`[ORDERS_API] Fallback also failed: ${fallbackError.message}`);
                return NextResponse.json({ orders: [], error: 'Failed to access database' }, { status: 200 });
            }
        }

        const orders = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            orders.push({
                _id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString()
            });
        });

        // Sort in-memory if we had to use the unordered fallback
        if (!snapshot.query._query?.explicitOrderBy?.length) {
            orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('[ORDERS_API] Critical Error:', error);
        return NextResponse.json({ orders: [], error: 'Failed to fetch orders' }, { status: 200 });
    }
}
