"use client";

import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import SidebarWrapper from "@/components/SidebarWrapper";
import {
  Plus,
  Upload,
  Trash2,
  DollarSign,
  Boxes,
  Info,
  Image as ImageIcon,
  CheckCircle,
  X,
  Save,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [prices, setPrices] = useState({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const [stocks, setStocks] = useState({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/admin/products/${id}`);
        const result = await response.json();

        if (result.success) {
          const productData = result.product;
          setProduct(productData);
          setPrices({
            XS: productData.sizes?.XS?.price || productData.price || 0,
            S: productData.sizes?.S?.price || productData.price || 0,
            M: productData.sizes?.M?.price || productData.price || 0,
            L: productData.sizes?.L?.price || productData.price || 0,
            XL: productData.sizes?.XL?.price || productData.price || 0,
            XXL: productData.sizes?.XXL?.price || productData.price || 0,
          });
          setStocks({
            XS: productData.sizes?.XS?.stock || 0,
            S: productData.sizes?.S?.stock || 0,
            M: productData.sizes?.M?.stock || 0,
            L: productData.sizes?.L?.stock || 0,
            XL: productData.sizes?.XL?.stock || 0,
            XXL: productData.sizes?.XXL?.stock || 0,
          });

          if (productData.image) {
            setPreviews(Array.isArray(productData.image) ? productData.image : [productData.image]);
          }
        } else {
          toast.error("Product not found");
          router.push("/admin/allProducts");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [params, router]);

  const handleSizePriceChange = (size, newPrice) => {
    setPrices(prev => ({ ...prev, [size]: newPrice }));
  };

  const handleSizeStockChange = (size, newStock) => {
    setStocks(prev => ({ ...prev, [size]: newStock }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { id } = await params;

    const formData = new FormData(e.target);
    for (let size of ["XS", "S", "M", "L", "XL", "XXL"]) {
      formData.append(`${size}_price`, prices[size]);
      formData.append(`${size}_stock`, stocks[size]);
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Product updated successfully!");
        router.push("/admin/allProducts");
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("Error updating product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
      </div>
    );
  }

  return (
    <SidebarWrapper>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              Edit Product
            </h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#048567]"></span>
              Modify product details and inventory
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl border-gray-200 font-bold text-xs uppercase tracking-widest px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#048567] text-white flex items-center justify-center shadow-lg shadow-[#048567]/20">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Basic Information</h2>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#048567] ml-1">Product Title</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={product.name}
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#048567] transition-all font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#048567] ml-1">Category</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={product.category}
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#048567] transition-all font-bold text-gray-800"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#048567] ml-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#048567] transition-all font-medium text-gray-800 min-h-[140px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#048567] ml-1">Base Price ₹</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={product.price}
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#048567] transition-all font-bold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#048567] ml-1">Discount %</label>
                <input
                  type="number"
                  name="discountPercentage"
                  defaultValue={product.discountPercentage}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#048567] transition-all font-bold text-gray-800"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Sizes & Inventory */}
          <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#048567] text-white flex items-center justify-center shadow-lg shadow-[#048567]/20">
                <Boxes className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Sizes & Inventory</h2>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <div key={size} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50 space-y-4 hover:border-[#048567]/30 transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[#048567]">{size}</span>
                      <CheckCircle className="w-4 h-4 text-[#048567] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Price"
                          value={prices[size] || ""}
                          onChange={(e) => handleSizePriceChange(size, parseFloat(e.target.value))}
                          className="w-full pl-9 pr-4 py-3 bg-white rounded-xl border-0 text-sm font-bold focus:ring-2 focus:ring-[#048567] transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={stocks[size] || ""}
                          onChange={(e) => handleSizeStockChange(size, parseInt(e.target.value, 10))}
                          className="w-full pl-9 pr-4 py-3 bg-white rounded-xl border-0 text-sm font-bold focus:ring-2 focus:ring-[#048567] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Media */}
          <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#048567] text-white flex items-center justify-center shadow-lg shadow-[#048567]/20">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Product Media</h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="relative group">
                <input
                  type="file"
                  name="image"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center group-hover:border-[#048567] group-hover:bg-[#048567]/5 transition-all">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#048567]" />
                  </div>
                  <p className="text-lg font-black text-gray-900 uppercase tracking-tighter">Replace Images</p>
                  <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">DRAG AND DROP OR CLICK TO BROWSE</p>
                </div>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                  {previews.map((src, index) => (
                    <div key={index} className="relative aspect-[4/5] rounded-2xl overflow-hidden group border border-gray-100 shadow-md">
                      <img src={src} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Preview ${index}`} />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-6 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-16 py-8 bg-[#048567] hover:bg-[#036e56] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#048567]/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-lg"
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
              <Save className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </SidebarWrapper>
  );
}