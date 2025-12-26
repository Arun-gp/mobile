"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit3, Trash2, Package, Eye } from "lucide-react";

export default function ProductList({ products }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-6 bg-gray-50 border-0 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#048567] placeholder-gray-300"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{filteredProducts.length} Items Found</span>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-50">
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#048567] py-6">Product</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#048567]">Category</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#048567]">Base Price</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#048567]">Stock</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#048567] text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id} className="group border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors">
                <TableCell className="py-6">
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm">
                        <img src={Array.isArray(product.image) ? product.image[0] : product.image} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-black text-gray-900 uppercase tracking-tight text-sm">{product.name}</p>
                      <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">{product.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-wider">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="font-bold text-gray-900">₹{product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-gray-300" />
                    <span className={`text-sm font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-gray-600'}`}>
                      {product.stock}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/product/${product._id}`)}
                      className="h-9 w-9 rounded-xl hover:bg-white hover:text-[#048567] hover:shadow-md"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/edit-product/${product._id}`)}
                      className="h-9 w-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-md"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product._id)}
                      className="h-9 w-9 rounded-xl hover:bg-white hover:text-red-500 hover:shadow-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No products found for this search</p>
          </div>
        )}
      </div>
    </div>
  );
}