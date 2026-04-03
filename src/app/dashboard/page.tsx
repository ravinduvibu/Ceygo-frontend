"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Filter, Heart, BadgeCheck, Star } from "lucide-react";
import TravelerSidebar from "@/components/TravelerSidebar";
import { supabase } from "@/lib/supabaseClient";

type Gig = {
    id: string;
    title: string;
    vendor: string;
    vendor_img: string;
    image: string;
    rating: number;
    reviews_count: number;
    price: string;
    level: string;
    category: string;
};

const CATEGORIES = [
    "All Categories", "Culinary & Food", "Nature & Wildlife",
    "Heritage Tours", "Local Crafts", "Wellness", "Adventure", "Transport",
];

export default function TouristDashboard() {
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [search, setSearch] = useState("");
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Fetch gigs from Supabase
    useEffect(() => {
        const fetchGigs = async () => {
            setLoading(true);
            let query = supabase
                .from("gigs")
                .select("id, title, vendor, vendor_img, image, rating, reviews_count, price, level, category")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (categoryFilter !== "All Categories") {
                query = query.eq("category", categoryFilter);
            }
            if (search.trim()) {
                query = query.ilike("title", `%${search.trim()}%`);
            }

            const { data, error } = await query;
            if (!error && data) setGigs(data);
            setLoading(false);
        };
        fetchGigs();
    }, [categoryFilter, search]);

    const toggleFavo = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            <TravelerSidebar activePage="Dashboard" />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-[72px] flex-shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200">
                    <div className="flex-1 max-w-2xl flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200 focus-within:border-[#ff6b35]/50 focus-within:bg-white focus-within:shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#ff6b35]/10">
                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input
                            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none flex-1 font-medium"
                            placeholder="What service are you looking for?"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                            <span>Search</span>
                        </button>
                    </div>
                </header>

                {/* Category tabs */}
                <div className="h-12 border-b border-slate-100 bg-white px-8 flex items-center space-x-8 overflow-x-auto shrink-0 select-none hide-scrollbar text-sm font-medium text-slate-500">
                    {CATEGORIES.map(cat => (
                        <div
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`cursor-pointer whitespace-nowrap hover:text-slate-900 transition-colors ${categoryFilter === cat ? "text-slate-900 border-b-2 border-[#ff6b35] h-full flex items-center" : "h-full flex items-center border-b-2 border-transparent"}`}
                        >
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900">Explore Local Experiences</h1>
                                <p className="text-sm text-slate-500 mt-1">Book directly from verified artisans and guides in Sri Lanka.</p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-600 font-semibold cursor-pointer border px-3 py-1.5 rounded-md border-slate-200 hover:border-slate-300">
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                            </div>
                        </div>

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="flex flex-col animate-pulse">
                                        <div className="aspect-[4/3] w-full rounded-xl bg-slate-100 mb-3" />
                                        <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
                                        <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                                        <div className="h-3 bg-slate-100 rounded w-4/5" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && gigs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
                                <div className="text-5xl">🔍</div>
                                <p className="text-lg font-bold text-slate-700">No experiences found</p>
                                <p className="text-sm text-slate-400">Try a different category or search term.</p>
                            </div>
                        )}

                        {/* Gig grid */}
                        {!loading && gigs.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {gigs.map(s => {
                                    const isLiked = favorites.includes(s.id);
                                    return (
                                        <Link key={s.id} href={`/gig/${s.id}`} className="group flex flex-col cursor-pointer">
                                            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 border border-slate-100 bg-slate-100">
                                                {s.image && (
                                                    <Image
                                                        src={s.image}
                                                        alt={s.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                                <div
                                                    onClick={e => toggleFavo(s.id, e)}
                                                    className={`absolute top-3 right-3 p-1.5 rounded-full z-10 hover:scale-110 active:scale-95 transition-all ${isLiked ? 'bg-white shadow-sm' : 'bg-black/20 hover:bg-black/30'}`}
                                                >
                                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2.5 mb-2 px-1">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-100 overflow-hidden relative shadow-sm">
                                                    {s.vendor_img && <Image src={s.vendor_img} alt={s.vendor} fill className="object-cover" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-[13px] font-bold text-slate-900 hover:underline leading-none">{s.vendor}</p>
                                                    <p className="text-[11px] text-[#ff6b35] font-semibold mt-0.5 leading-none">{s.level}</p>
                                                </div>
                                            </div>

                                            <h3 className="text-sm text-slate-700 leading-snug line-clamp-2 hover:underline mb-2 px-1 font-medium">{s.title}</h3>

                                            <div className="flex items-center space-x-1.5 mb-2.5 px-1 mt-auto">
                                                <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                                                <span className="text-sm font-bold text-slate-900">{s.rating}</span>
                                                <span className="text-sm text-slate-400">({s.reviews_count})</span>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                                                <div>
                                                    {s.level?.includes("Pro") && (
                                                        <span className="flex items-center space-x-0.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm">
                                                            <BadgeCheck className="w-2.5 h-2.5 mr-0.5" /> Pro
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Starting At</p>
                                                    <p className="text-base font-black text-slate-900 leading-none">LKR {s.price}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
