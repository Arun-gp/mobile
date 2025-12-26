import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, addDoc, where, Timestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// GET /api/reviews?productId=xxx - Fetch reviews for a product
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const reviewsRef = collection(db, 'reviews');
        let snapshot;

        try {
            // Priority 1: Ordered by date (Ideal UX)
            const q = query(
                reviewsRef,
                where('productId', '==', productId),
                orderBy('createdAt', 'desc'),
                limit(50)
            );
            snapshot = await getDocs(q);
        } catch (queryError) {
            // If we're here, the composite index is likely missing
            console.warn(`[REVIEWS_API] Ordered query failed for ${productId}. Falling back to unordered fetch. Error: ${queryError.message}`);

            try {
                // Priority 2: Filter by productId only (Unordered, but safe)
                const fallbackQuery = query(
                    reviewsRef,
                    where('productId', '==', productId),
                    limit(50)
                );
                snapshot = await getDocs(fallbackQuery);
            } catch (fallbackError) {
                console.error(`[REVIEWS_API] Fallback query also failed: ${fallbackError.message}`);
                // Priority 3: Return empty state with 200 to keep the UI alive
                return NextResponse.json({
                    reviews: [],
                    averageRating: 0,
                    totalReviews: 0,
                    warning: 'Database indexes are currently being updated. Reviews will be available shortly.'
                });
            }
        }

        const reviews = [];
        let totalRating = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const rating = parseInt(data.rating) || 0;
            reviews.push({
                id: doc.id,
                rating: rating,
                review: data.review || "",
                userName: data.userName || 'Anonymous',
                date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            });
            totalRating += rating;
        });

        // Sort in memory if we fell back to unordered fetch
        if (snapshot.query._query?.explicitOrderBy?.length === 0) {
            reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        return NextResponse.json({
            reviews,
            averageRating: parseFloat(averageRating),
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('[REVIEWS_API] Critical Error:', error);
        return NextResponse.json({
            reviews: [],
            averageRating: 0,
            totalReviews: 0,
            error: 'Failed to process reviews',
            details: error.message
        }, { status: 200 }); // Still return 200 to prevent Next.js error overlay
    }
}

// POST /api/reviews - Create a new review
export async function POST(request) {
    try {
        const body = await request.json();
        const { productId, rating, review, userName } = body;

        if (!productId || !rating || !review) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const reviewsRef = collection(db, 'reviews');
        const newReview = await addDoc(reviewsRef, {
            productId,
            rating: parseInt(rating),
            review,
            userName: userName || 'Anonymous',
            createdAt: Timestamp.now()
        });

        return NextResponse.json({
            id: newReview.id,
            rating: parseInt(rating),
            review,
            userName: userName || 'Anonymous',
            date: new Date().toISOString()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
