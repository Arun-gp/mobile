import { headers } from 'next/headers';
import ProductsList from "./ProductsList"; // Ensure this path is correct

export default async function ProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || '';
  const category = resolvedParams.category || '';
  const page = parseInt(resolvedParams.page) || 1;
  const minPrice = parseFloat(resolvedParams.minPrice) || 0;
  const maxPrice = parseFloat(resolvedParams.maxPrice) || Number.MAX_SAFE_INTEGER;
  const limit = 10;

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  try {
    const response = await fetch(`${protocol}://${host}/api/search?query=${query}&category=${category}&page=${page}&minPrice=${minPrice}&maxPrice=${maxPrice}&limit=${limit}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON response from Search API. First 100 chars:", text.substring(0, 100));
      throw new Error("Invalid response format from server");
    }

    const { products, totalProducts, priceRange } = data;
    const totalPages = Math.ceil((totalProducts || 0) / limit);

    return (
      <div>
        <ProductsList
          filteredProducts={products || []}
          page={page}
          totalPages={totalPages}
          currentCategory={category}
          priceRange={priceRange}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in ProductsPage:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600">We could not load the products. Please try refreshing the page.</p>
      </div>
    );
  }
}