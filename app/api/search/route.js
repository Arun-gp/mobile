import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const searchQuery = searchParams.get('query') || '';
        const category = searchParams.get('category') || '';
        const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
        const maxPrice = parseFloat(searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        let allProducts = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data(),
        }));

        // Client-side filtering (in API for simplicity and to avoid complex composite index issues)
        let filteredProducts = allProducts.filter(product => {
            const matchesQuery = (product.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (product.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
            const matchesCategory = category ? product.category === category : true;
            const matchesPrice = (parseFloat(product.price) || 0) >= minPrice && (parseFloat(product.price) || 0) <= maxPrice;

            return matchesQuery && matchesCategory && matchesPrice;
        });

        // Calculate price range for the sidebar filters
        let priceRange = { min: 0, max: 10000 };
        if (filteredProducts.length > 0) {
            const prices = filteredProducts.map(p => parseFloat(p.price) || 0);
            priceRange = {
                min: Math.floor(Math.min(...prices)),
                max: Math.ceil(Math.max(...prices))
            };
        }

        const totalProducts = filteredProducts.length;

        // Pagination
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

        const mappedProducts = paginatedProducts.map(product => {
            const data = product;
            return {
                _id: data._id || data.id,
                name: String(data.name || "Unnamed Product"),
                description: String(data.description || ""),
                price: Number(data.price) || 0,
                discountPercentage: Number(data.discountPercentage) || 0,
                image: Array.isArray(data.image) ? data.image[0] : (data.image || ""),
                category: String(data.category || "General"),
                stock: Number(data.stock) || 0,
                sizes: data.sizes || {}
            };
        });

        console.log(`API Search: Returning ${mappedProducts.length} products`);

        return NextResponse.json({
            products: mappedProducts,
            totalProducts,
            priceRange,
            page,
            totalPages: Math.ceil(totalProducts / limit)
        });
    } catch (error) {
        console.error("Error in Search API:", error);
        return NextResponse.json({ message: "Search failed", error: error.message }, { status: 500 });
    }
}
