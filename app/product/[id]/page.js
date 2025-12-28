import { headers } from "next/headers";
import ProductList from "./ProductList";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  try {
    const [productRes, relatedRes] = await Promise.all([
      fetch(`${protocol}://${host}/api/products/${id}`, { cache: "no-store" }),
      fetch(`${protocol}://${host}/api/products`, { cache: "no-store" }),
    ]);

    // If product fetch failed, show a friendly not-found UI instead of throwing
    if (!productRes.ok) {
      const status = productRes.status;
      const statusText = productRes.statusText || "";

      // For server errors, show a retryable error message; for 404 show not-found
      if (status >= 500) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Server Error</h2>
            <p className="text-gray-600 mb-4">There was a problem loading the product details. Please try again later.</p>
            <a href="/products" className="text-indigo-600 hover:underline font-medium">Back to Shop</a>
          </div>
        );
      }

      // 404 or other client errors
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you&apos;re looking for might have been removed or the link is incorrect.</p>
          <a href="/products" className="text-indigo-600 hover:underline font-medium">Back to Shop</a>
        </div>
      );
    }

    const productData = await productRes.json();
    const relatedProducts = relatedRes.ok ? await relatedRes.json() : [];

    console.log(
      `Detail Page: Fetched product "${productData.product?.name}" (ID: ${id})`
    );
    console.log(
      `Detail Page: Fetched ${Array.isArray(relatedProducts) ? relatedProducts.length : 0
      } related products`
    );

    if (!productData.success || !productData.product) {
      console.error(
        `Detail Page ERROR: Product ID ${id} not found in database.`
      );

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>

          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for might have been removed or the
            link is incorrect.
          </p>

          <a
            href="/products"
            className="text-indigo-600 hover:underline font-medium"
          >
            Back to Shop
          </a>
        </div>
      );
    }

    return (
      <ProductList
        product={productData.product}
        relatedProducts={
          Array.isArray(relatedProducts) ? relatedProducts : []
        }
      />
    );
  } catch (error) {
    console.error("Error fetching product details:", error);

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">
          Failed to load product details: {error.message}
        </p>
      </div>
    );
  }
}
