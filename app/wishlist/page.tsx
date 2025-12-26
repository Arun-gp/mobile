"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Heart, Package, ArrowRight, Star } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

interface WishlistItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
}

export default function WishlistPage() {
    const { user } = useAuth() as { user: { uid: string } | null };
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`/api/wishlist?userId=${user?.uid}`);
            const data = await res.json();
            setWishlist(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (id: string) => {
        try {
            const res = await fetch(`/api/wishlist?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setWishlist(prev => prev.filter(item => item.id !== id));
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            toast.error("Failed to remove");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-8 text-gray-300">
                    <Heart className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-4">Guardians of Style</h1>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest text-center max-w-xs mb-10">Sign in to sync your curated collection across devices.</p>
                <Link href="/login">
                    <Button className="bg-[#048567] hover:bg-[#036e56] text-white px-10 py-7 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#048567]/20">
                        Login to View
                    </Button>
                </Link>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-8 text-gray-300">
                    <Package className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-4">Empty Curation</h1>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest text-center max-w-xs mb-10">Your personal style registry is currently awaiting inspiration.</p>
                <Link href="/products">
                    <Button className="bg-[#1a1a1a] hover:bg-black text-white px-10 py-7 rounded-2xl font-black uppercase tracking-widest transition-all">
                        Discover Trends
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] py-20 lg:py-32">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-gray-100 pb-12">
                    <div>
                        <div className="flex items-center gap-3 text-[#048567] mb-4">
                            <Heart className="w-5 h-5 fill-[#048567]" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Personal Registry</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter italic">My Wishlist</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black text-gray-900 italic tracking-tighter">{wishlist.length}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saved Pieces</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group flex flex-col bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden transition-all hover:-translate-y-2">
                            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                                <Image
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-6 right-6">
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-6 left-6 flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className="w-3 h-3 text-[#048567] fill-[#048567]" />
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex-1 mb-6">
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight line-clamp-2 mb-2 group-hover:text-[#048567] transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-2xl font-black text-gray-800 italic tracking-tighter">₹{item.price}</p>
                                </div>

                                <Link href={`/product/${item.productId}`}>
                                    <Button className="w-full bg-[#1a1a1a] hover:bg-black text-white rounded-2xl py-7 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all group/btn">
                                        VIEW DETAILS
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
