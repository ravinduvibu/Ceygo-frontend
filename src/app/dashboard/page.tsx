"use client";

import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Compass,
    Star,
    BookOpen,
    Settings,
    ChevronRight,
    Search,
    Filter,
    LogOut,
    ChevronDown,
    Heart,
    BadgeCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Mock Data ──────────────────────────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, count: 0, href: "/dashboard" },
    { icon: Bookmark, label: "My Verified Journeys", active: false, count: 3, href: "/dashboard/My-Verified-Journeys" },
    { icon: MessageSquare, label: "Message Artisan", active: false, count: 2, href: "/messages" },
    { icon: Compass, label: "Find Experiences", active: false, count: 0, href: "/search" },
    { icon: Heart, label: "Wishlist", active: false, count: 0, href: "/wishlist" },
    { icon: Star, label: "Verified Reviews", active: false, count: 0, href: "/verified-reviews/traveler" },
    { icon: BookOpen, label: "Platform Guide", active: false, count: 0, href: "/guide" },
    { icon: Settings, label: "Settings", active: false, count: 0, href: "/settings/traveler" },
];

const services = [
    {
        id: 1,
        title: "I will host an authentic Southern Sri Lankan cooking class in Galle",
        vendor: "Kumari Jayawardena",
        vendorImg: "/images/traveler2.png",
        image: "/images/cooking_class_galle.png",
        rating: 4.9,
        reviews: 142,
        price: "3,200",
        level: "Top Rated",
        isFavo: false,
    },
    {
        id: 2,
        title: "I will take you on a verified ethical elephant safari in Udawalawe",
        vendor: "Saman Wildlife",
        vendorImg: "/images/traveler3.png",
        image: "/images/elephant_safari_udawalawe.png",
        rating: 5.0,
        reviews: 89,
        price: "8,500",
        level: "Level 2 Seller",
        isFavo: true,
    },
    {
        id: 3,
        title: "I will guide a sunset TukTuk food tour around Colombo Fort",
        vendor: "Nuwan's Tuk Tours",
        vendorImg: "/images/traveler1.png",
        image: "/images/tuktuk_food_tour_colombo.png",
        rating: 4.8,
        reviews: 215,
        price: "2,800",
        level: "Top Rated",
        isFavo: false,
    },
    {
        id: 4,
        title: "I will teach you traditional wooden mask carving in Ambalangoda",
        vendor: "Ariyaratne Studio",
        vendorImg: "/images/traveler2.png",
        image: "/images/mask_carving_ambalangoda.png",
        rating: 4.9,
        reviews: 67,
        price: "5,100",
        level: "Level 1 Seller",
        isFavo: false,
    },
    {
        id: 5,
        title: "I will organize a private hike to Nine Arches Bridge at sunrise",
        vendor: "Ella Trail Guides",
        vendorImg: "/images/traveler3.png",
        image: "/images/nine_arches_bridge_sunrise.png",
        rating: 5.0,
        reviews: 310,
        price: "4,000",
        level: "Top Rated",
        isFavo: true,
    },
    {
        id: 6,
        title: "I will craft a customized 3-day cultural heritage itinerary via train",
        vendor: "Malini Perera",
        vendorImg: "/images/traveler1.png",
        image: "/images/cultural_heritage_train_trip.png",
        rating: 4.8,
        reviews: 44,
        price: "12,500",
        level: "New Seller",
        isFavo: false,
    },
    {
        id: 7,
        title: "I will teach you how to surf at a hidden reef break in Weligama",
        vendor: "Surfer Kasun",
        vendorImg: "/images/traveler2.png",
        image: "/images/surfing_weligama_reef.png",
        rating: 4.9,
        reviews: 120,
        price: "4,500",
        level: "Level 2 Seller",
        isFavo: false,
    },
    {
        id: 8,
        title: "I will host a traditional Ayurvedic healing and meditation session",
        vendor: "Dr. Wickramasinghe",
        vendorImg: "/images/traveler3.png",
        image: "/images/ayurvedic_meditation_session_sri_lanka.png",
        rating: 5.0,
        reviews: 58,
        price: "7,200",
        level: "Verified Pro",
        isFavo: false,
    },
];

const CLEARED_KEY = "ceygo_nav_cleared";

function getClearedLabels(): string[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(CLEARED_KEY) || "[]"); } catch { return []; }
}
function clearNavLabel(label: string) {
    const cleared = getClearedLabels();
    if (!cleared.includes(label)) {
        localStorage.setItem(CLEARED_KEY, JSON.stringify([...cleared, label]));
    }
}

export default function TouristDashboard() {
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [favorites, setFavorites] = useState<number[]>(services.filter(s => s.isFavo).map(s => s.id));
    const [clearedLabels, setClearedLabels] = useState<string[]>([]);

    useEffect(() => {
        // Auto-clear the active page's nav item on mount
        clearNavLabel("Dashboard");
        setClearedLabels(getClearedLabels());
    }, []);

    const handleNavClick = (label: string) => {
        clearNavLabel(label);
        setClearedLabels(getClearedLabels());
    };

    const categories = ["All Categories", "Culinary & Food", "Nature & Wildlife", "Heritage Tours", "Local Crafts", "Wellness", "Adventure", "Transport"];
    
    const toggleFavo = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, active, count, href }) => {
                        const rawCount = label === "Wishlist" ? favorites.length : count;
                        const displayCount = clearedLabels.includes(label) ? 0 : rawCount;
                        return (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => handleNavClick(label)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                    ? "bg-orange-50 text-[#ff6b35] border border-orange-100 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${active ? "text-[#ff6b35]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span>{label}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {displayCount > 0 && (
                                    <span className="text-xs font-bold bg-[#ff6b35]/10 text-[#ff6b35] px-1.5 py-0.5 rounded-full">{displayCount}</span>
                                )}
                                {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                            </div>
                        </Link>
                    )})}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            AL
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Alex Müller</p>
                            <p className="text-xs text-slate-400 truncate">Traveler · Verified</p>
                        </div>
                        <Link 
                            href="/" 
                            onClick={() => { document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; }}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-auto"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── Main Dashboard ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Navbar */}
                <header className="h-[72px] flex-shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200">
                    <div className="flex-1 max-w-2xl flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200 focus-within:border-[#ff6b35]/50 focus-within:bg-white focus-within:shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#ff6b35]/10">
                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input
                            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none flex-1 font-medium"
                            placeholder="What service are you looking for?"
                        />
                        <button className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                            <span>Search</span>
                        </button>
                    </div>
                </header>

                {/* Sub-Header (Categories like Ceygo) */}
                <div className="h-12 border-b border-slate-100 bg-white px-8 flex items-center space-x-8 overflow-x-auto shrink-0 select-none hide-scrollbar text-sm font-medium text-slate-500">
                    {categories.map((cat) => (
                        <div 
                            key={cat} 
                            onClick={() => setCategoryFilter(cat)}
                            className={`cursor-pointer whitespace-nowrap hover:text-slate-900 transition-colors ${categoryFilter === cat ? "text-slate-900 border-b-2 border-[#ff6b35] h-full flex items-center" : "h-full flex items-center border-b-2 border-transparent"}`}
                        >
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Body Canvas */}
                <main className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="max-w-[1600px] mx-auto">
                        
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900">Explore Local Experiences</h1>
                                <p className="text-sm text-slate-500 mt-1">Book directly from verified artisans and guides in Sri Lanka.</p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 text-sm text-slate-600 font-semibold cursor-pointer border px-3 py-1.5 rounded-md border-slate-200 hover:border-slate-300">
                                    <Filter className="w-4 h-4" />
                                    <span>Filters</span>
                                </div>
                            </div>
                        </div>

                        {/* Fiverr Style Gig Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {services.map((s) => {
                                const isLiked = favorites.includes(s.id);
                                return (
                                    <Link key={s.id} href={`/gig/${s.id}`} className="group flex flex-col cursor-pointer">
                                        {/* Image Thumbnail wrapper */}
                                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 border border-slate-100 bg-slate-100">
                                            <Image 
                                                src={s.image} 
                                                alt={s.title} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                            {/* Heart / Save Overlay */}
                                            <div 
                                                onClick={(e) => toggleFavo(s.id, e)}
                                                className={`absolute top-3 right-3 p-1.5 rounded-full z-10 hover:scale-110 active:scale-95 transition-all ${isLiked ? 'bg-white shadow-sm' : 'bg-black/20 hover:bg-black/30'}`}
                                            >
                                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                            </div>
                                        </div>

                                        {/* Seller Row */}
                                        <div className="flex items-center space-x-2.5 mb-2 px-1">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-100 overflow-hidden relative shadow-sm">
                                                <Image src={s.vendorImg} alt={s.vendor} fill className="object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[13px] font-bold text-slate-900 hover:underline leading-none">{s.vendor}</p>
                                                <p className="text-[11px] text-[#ff6b35] font-semibold mt-0.5 leading-none">{s.level}</p>
                                            </div>
                                        </div>

                                        {/* Gig Title */}
                                        <h3 className="text-sm text-slate-700 leading-snug line-clamp-2 hover:underline mb-2 px-1 font-medium">
                                            {s.title}
                                        </h3>

                                        {/* Ratings */}
                                        <div className="flex items-center space-x-1.5 mb-2.5 px-1 mt-auto">
                                            <div className="flex items-center space-x-0.5">
                                                <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                                                <span className="text-sm font-bold text-slate-900">{s.rating}</span>
                                            </div>
                                            <span className="text-sm text-slate-400">({s.reviews})</span>
                                        </div>

                                        {/* Pricing Footer */}
                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                                            <div className="flex items-center space-x-1.5">
                                                {s.level.includes("Pro") && (
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

                    </div>
                </main>
            </div>
        </div>
    );
}
