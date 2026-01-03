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
            // Dispatch event to notify other components
            window.dispatchEvent(new Event('wishlistUpdated'));
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
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                        {wishlist.map((item) => (
                            <li key={item.id} className="bg-white rounded-lg border border-gray-50 shadow-sm overflow-hidden flex flex-col">
                                <div className="w-full h-48 sm:h-40 md:h-44 lg:h-40 overflow-hidden bg-gray-50">
                                    <Image src={item.image || '/placeholder.png'} alt={item.name} width={600} height={400} className="object-cover w-full h-full" />
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="font-bold text-gray-900 truncate">{item.name}</div>
                                        <div className="text-xs text-gray-500 mt-1 truncate-break">Product ID: {item.productId}</div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <div className="font-black text-gray-900 text-lg">₹{item.price}</div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                aria-label={`Add ${item.name} to cart`}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                                            >
                                                Add to Cart
                                            </button>

                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                aria-label={`Remove ${item.name} from wishlist`}
                                                className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
