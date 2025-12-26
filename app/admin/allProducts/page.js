import { headers } from 'next/headers';
import ProductList from './ProductList';
import SidebarWrapper from '@/components/SidebarWrapper';

export default async function AdminProductsPage() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  let products = [];
  try {
    const response = await fetch(`${protocol}://${host}/api/products`, {
      cache: 'no-store'
    });

    if (response.ok) {
      products = await response.json();
    }
  } catch (error) {
    console.error('Error fetching admin products:', error);
  }

  return (
    <SidebarWrapper>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
            All Products
          </h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#048567]"></span>
            Manage your boutique inventory
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <ProductList products={Array.isArray(products) ? products : []} />
        </div>
      </div>
    </SidebarWrapper>
  );
}
