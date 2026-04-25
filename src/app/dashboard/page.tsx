"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Filter, Heart, BadgeCheck, Star } from "lucide-react";
import TravelerSidebar from "@/components/TravelerSidebar";

interface GigProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
}

interface Gig {
    id: string;
    title: string;
    price: number;
    category: string | null;
    location: string | null;
    image_url: string | null;
    rating: number | null;
    reviews_count: number | null;
    profiles: GigProfile | null;
}

const CATEGORIES = [
    "All Categories", "Transport", "Local Guide", "Experiences",
    "Artisan", "Culinary & Food", "Nature & Wildlife",
    "Heritage Tours", "Local Crafts", "Wellness", "Adventure",
];

const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590845947376-2638caa89309?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=600&auto=format&fit=crop",
];

export default function TouristDashboard() {
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (categoryFilter !== "All Categories") params.set("category", categoryFilter);
        if (search) params.set("q", search);

        fetch(`/api/gigs?${params}`)
            .then(r => r.json())
            .then(data => {
                setGigs(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [categoryFilter, search]);

    const toggleFavo = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const formatPrice = (price: number) =>
        price.toLocaleString("en-LK");

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
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && setSearch(searchInput)}
                        />
                        <button
                            onClick={() => setSearch(searchInput)}
                            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                        >
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
                            className={`cursor-pointer whitespace-nowrap hover:text-slate-900 transition-colors ${
                                categoryFilter === cat
                                    ? "text-slate-900 border-b-2 border-[#ff6b35] h-full flex items-center"
                                    : "h-full flex items-center border-b-2 border-transparent"
                            }`}
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

                        {loading && (
                            <div className="flex items-center justify-center py-24">
                                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#ff6b35] animate-spin" />
                            </div>
                        )}

                        {!loading && gigs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
                                <div className="text-5xl">🌴</div>
                                <p className="text-lg font-bold text-slate-700">No experiences found</p>
                                <p className="text-sm text-slate-400">
                                    {search || categoryFilter !== "All Categories"
                                        ? "Try a different category or search term."
                                        : "Partners haven't published any experiences yet. Check back soon!"}
                                </p>
                            </div>
                        )}

                        {!loading && gigs.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {gigs.map((gig, idx) => {
                                    const isLiked = favorites.includes(gig.id);
                                    const vendorName = gig.profiles?.full_name ?? "Partner";
                                    const vendorImg = gig.profiles?.avatar_url ?? "/images/traveler1.png";
                                    const image = gig.image_url ?? PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];
                                    const rating = gig.rating ?? 0;
                                    const reviewsCount = gig.reviews_count ?? 0;

                                    return (
                                        <Link key={gig.id} href={`/gig/${gig.id}`} className="group flex flex-col cursor-pointer">
                                            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 border border-slate-100 bg-slate-100">
                                                <Image
                                                    src={image}
                                                    alt={gig.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div
                                                    onClick={e => toggleFavo(gig.id, e)}
                                                    className={`absolute top-3 right-3 p-1.5 rounded-full z-10 hover:scale-110 active:scale-95 transition-all ${isLiked ? "bg-white shadow-sm" : "bg-black/20 hover:bg-black/30"}`}
                                                >
                                                    <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2.5 mb-2 px-1">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-100 overflow-hidden relative shadow-sm">
                                                    <Image src={vendorImg} alt={vendorName} fill className="object-cover" />
                                                </div>
                                                <p className="text-[13px] font-bold text-slate-900 hover:underline leading-none">{vendorName}</p>
                                            </div>

                                            <h3 className="text-sm text-slate-700 leading-snug line-clamp-2 hover:underline mb-2 px-1 font-medium">{gig.title}</h3>

                                            {rating > 0 && (
                                                <div className="flex items-center space-x-1.5 mb-2.5 px-1 mt-auto">
                                                    <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                                                    <span className="text-sm font-bold text-slate-900">{rating.toFixed(1)}</span>
                                                    <span className="text-sm text-slate-400">({reviewsCount})</span>
                                                </div>
                                            )}

                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                                                <div>
                                                    {gig.category && (
                                                        <span className="flex items-center space-x-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm">
                                                            <BadgeCheck className="w-2.5 h-2.5 mr-0.5" />{gig.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Starting At</p>
                                                    <p className="text-base font-black text-slate-900 leading-none">LKR {formatPrice(gig.price)}</p>
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
