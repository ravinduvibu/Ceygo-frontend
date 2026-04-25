"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { GigMapItem } from "@/components/GigMap";
import {
    Search,
    SlidersHorizontal,
    MapPin,
    Star,
    ShieldCheck,
    Sparkles,
    ChevronLeft,
    X,
    Loader2,
} from "lucide-react";


// Leaflet cannot run on the server — load it only in the browser
const GigMap = dynamic(() => import("@/components/GigMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
    ),
});

interface ApiGig {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string | null;
    location: string | null;
    image_url: string | null;
    rating: number | null;
    reviews_count: number | null;
    is_active: boolean;
    profiles: { id: string; full_name: string | null } | null;
}


export default function SearchDiscoveryPage() {
    const [gigs, setGigs] = useState<ApiGig[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const fetchGigs = useCallback(async (q: string) => {
        setIsSearching(true);
        try {
            const url = q.trim() ? `/api/gigs?q=${encodeURIComponent(q.trim())}` : "/api/gigs";
            const res = await fetch(url);
            const data = await res.json();
            setGigs(Array.isArray(data) ? data : []);
            if (!hoveredId && Array.isArray(data) && data.length > 0) {
                setHoveredId(data[0].id);
            }
        } finally {
            setIsSearching(false);
            setLoading(false);
        }
    }, [hoveredId]);

    // Initial load
    useEffect(() => { fetchGigs(""); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Debounced search
    useEffect(() => {
        if (searchQuery.length === 1) return;
        const t = setTimeout(() => fetchGigs(searchQuery), 300);
        return () => clearTimeout(t);
    }, [searchQuery, fetchGigs]);

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        const invalid = /[<>{}[\]\\^~]/.test(val);
        if (invalid) {
            setValidationError("Search contains invalid characters");
        } else if (val.length === 1) {
            setValidationError("Please enter at least 2 characters");
        } else {
            setValidationError(null);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setValidationError(null);
        fetchGigs("");
    };

    const mapGigs: GigMapItem[] = gigs.map(g => ({
        id: g.id,
        title: g.title,
        price: g.price,
        location: g.location,
        category: g.category,
    }));

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* ── LEFT PANEL ── */}
            <div className="w-full lg:w-[40%] xl:w-[35%] h-full flex flex-col bg-white shadow-[10px_0_30px_-15px_rgba(0,0,0,0.1)] z-20 relative">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-white">
                    <div className="flex items-center space-x-3 mb-6">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Discover Ceygo</h1>
                    </div>

                    <div className="relative group mb-2">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {isSearching
                                ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                                : <Search className="w-4 h-4 text-emerald-500" />
                            }
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm ${
                                validationError
                                    ? "border-red-400 focus:border-red-500"
                                    : "border-slate-200 focus:border-emerald-500 focus:bg-white"
                            }`}
                            placeholder="Search experiences, drivers, artisans..."
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
                            {searchQuery && (
                                <button onClick={clearSearch} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <button className="h-8 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors flex items-center">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="h-4 mb-4">
                        {validationError && (
                            <p className="text-[10px] font-bold text-red-500 ml-4 animate-in fade-in slide-in-from-top-1">
                                {validationError}
                            </p>
                        )}
                    </div>

                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {searchQuery ? `Results for "${searchQuery}"` : "Verified Local Gigs"}
                        </p>
                        {!loading && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                {gigs.length} found
                            </span>
                        )}
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                            <p className="text-sm text-slate-400">Loading gigs…</p>
                        </div>
                    )}

                    {!loading && gigs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-2">No results found</h3>
                            <p className="text-sm text-slate-500 max-w-[240px] mb-8 leading-relaxed">
                                {searchQuery
                                    ? <>We couldn&apos;t find anything matching &ldquo;<span className="font-bold text-slate-700">{searchQuery}</span>&rdquo;.</>
                                    : "No gigs are live yet. Check back soon!"}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && gigs.map((gig) => (
                        <div
                            key={gig.id}
                            onClick={() => setHoveredId(gig.id)}
                            onMouseEnter={() => setHoveredId(gig.id)}
                            onMouseLeave={() => setHoveredId(gigs[0]?.id ?? null)}
                            className={`flex space-x-4 p-4 rounded-3xl bg-white border transition-all duration-200 cursor-pointer ${
                                hoveredId === gig.id
                                    ? "border-[#0ea5e9]/40 shadow-md ring-4 ring-[#0ea5e9]/5"
                                    : "border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md"
                            }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                                {gig.image_url ? (
                                    <Image src={gig.image_url} alt={gig.title} fill className="object-cover" sizes="96px" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">
                                        {gig.category === "Transport" ? "🚗" : gig.category === "Food" ? "🍛" : "✨"}
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {gig.category ?? "Experience"}
                                        </span>
                                        {gig.rating && gig.rating > 0 ? (
                                            <div className="flex items-center text-xs font-bold text-slate-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                                                {gig.rating.toFixed(1)}
                                                {gig.reviews_count ? <span className="text-slate-400 font-normal ml-0.5">({gig.reviews_count})</span> : null}
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">New</span>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold truncate text-slate-800">{gig.title}</h3>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-1 text-slate-500">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="text-xs font-medium truncate max-w-[100px]">
                                            {gig.location ?? "Sri Lanka"}
                                        </span>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                        LKR {gig.price.toLocaleString("en-LK")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT PANEL: Real Leaflet Map ── */}
            <div className="hidden lg:flex lg:w-[60%] xl:w-[65%] h-full relative">
                <GigMap
                    gigs={mapGigs}
                    focusedId={hoveredId}
                    onMarkerClick={(id) => setHoveredId(id)}
                />

                {/* AI chat bubble — sits above the map */}
                <button className="absolute bottom-8 right-8 group z-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
                    <div className="relative flex items-center space-x-3 bg-slate-900 px-5 py-3.5 rounded-full shadow-2xl border border-slate-700/50 hover:scale-105 transition-transform duration-300">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-inner">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-black text-white tracking-wide">Ask AI Guide</p>
                            <p className="text-[10px] text-slate-400 font-medium">Find niche places nearby</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
