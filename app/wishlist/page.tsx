"use client";

import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Heart, ArrowRight, Star } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";

interface WishlistItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
}

export default function WishlistPage() {
    const { addToCart } = useContext(CartContext);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    useEffect(() => {
        // Read wishlistItems from localStorage (frontend-only wishlist)
        try {
            const raw = localStorage.getItem("wishlistItems");
            const items = raw ? JSON.parse(raw) : [];
            setWishlist(Array.isArray(items) ? items : []);
        } catch (e) {
            console.error("Failed to load wishlist from localStorage", e);
            setWishlist([]);
        }
    }, []);

    const removeFromWishlist = (id: string) => {
        try {
            const filtered = wishlist.filter((x) => x.id !== id);
            setWishlist(filtered);
            localStorage.setItem("wishlistItems", JSON.stringify(filtered));
            toast.success("Removed from wishlist");
        } catch (e) {
            toast.error("Failed to remove");
        }
    };

    const handleAddToCart = (item: WishlistItem) => {
        try {
            // Convert to product shape expected by CartContext (use productId as id)
            const product = { ...item, _id: item.productId } as any;
            addToCart(product, null);
            toast.success("Added to cart");
        } catch (e) {
            toast.error("Failed to add to cart");
        }
    };

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-8 text-gray-300">
                    <Heart className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-500 font-medium text-center max-w-md mb-8">Like products to save them here. Your wishlist is stored locally in your browser.</p>
                <Link href="/products">
                    <Button className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] py-20 lg:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center gap-3 text-[#e0245e] mb-2">
                            <Heart className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">My Wishlist</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">Saved Items</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black text-gray-900">{wishlist.length}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">items</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm text-gray-500">Product</th>
                                <th className="text-left px-6 py-4 text-sm text-gray-500">Price</th>
                                <th className="text-right px-6 py-4 text-sm text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlist.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={item.image || '/placeholder.png'} alt={item.name} width={80} height={80} className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 line-clamp-1">{item.name}</div>
                                                <div className="text-xs text-gray-500">Product ID: {item.productId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="font-black text-gray-900">₹{item.price}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right align-middle">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => handleAddToCart(item)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">Add to Cart</button>
                                            <button onClick={() => removeFromWishlist(item.id)} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-2">
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
