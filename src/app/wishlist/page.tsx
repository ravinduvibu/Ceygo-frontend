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
    Heart,
    LogOut,
    Trash2,
    BadgeCheck,
    MapPin,
    Share2,
    ShoppingCart,
    SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TravelerSidebar from "@/components/TravelerSidebar";

export interface WishlistItem {
    id: string; // the wishlist row ID
    serviceId: string;
    title: string;
    vendor: string;
    vendorImg: string;
    image: string;
    rating: number;
    reviews: number;
    price: string;
    level: string;
    location: string;
    category: string;
    savedDate: string;
}

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

// ── Nav (matches dashboard sidebar) ─────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard",            active: false, count: 0, href: "/dashboard" },
    { icon: Bookmark,        label: "My Verified Journeys", active: false, count: 3, href: "/dashboard/My-Verified-Journeys" },
    { icon: MessageSquare,   label: "Message Artisan",      active: false, count: 2, href: "/messages" },
    { icon: Compass,         label: "Find Experiences",     active: false, count: 0, href: "/search" },
    { icon: Heart,           label: "Wishlist",             active: true,  count: 0, href: "/wishlist" },
    { icon: Star,            label: "Verified Reviews",     active: false, count: 0, href: "/verified-reviews/traveler" },
    { icon: BookOpen,        label: "Platform Guide",       active: false, count: 0, href: "/guide" },
    { icon: Settings,        label: "Settings",             active: false, count: 0, href: "/settings/traveler" },
];

const categories = ["All", "Nature & Wildlife", "Adventure", "Culinary & Food", "Transport", "Wellness"];

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [clearedLabels, setClearedLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Sidebar states matching TravelerSidebar
    const [fullName, setFullName] = useState("");
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [activeJourneys, setActiveJourneys] = useState(0);

    useEffect(() => {
        clearNavLabel("Wishlist");
        setTimeout(() => {
            setClearedLabels(getClearedLabels());

            // ── Mock Wishlist Data ─────────────────────────────────
            const mockData: WishlistItem[] = [
                { id: "w1", serviceId: "gig-001", title: "Sunset TukTuk City Tour through the streets of Colombo", vendor: "Nuwan Perera", vendorImg: "/images/traveler1.png", image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=600", rating: 4.9, reviews: 128, price: "2,800", level: "Top Rated", location: "Colombo", category: "Adventure", savedDate: "Apr 10, 2026" },
                { id: "w2", serviceId: "gig-002", title: "Hidden Colombo Street Food Walk — Local Secrets Only", vendor: "Saman Silva", vendorImg: "/images/traveler2.png", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600", rating: 5.0, reviews: 47, price: "4,500", level: "Verified Pro", location: "Pettah, Colombo", category: "Culinary & Food", savedDate: "Apr 8, 2026" },
                { id: "w3", serviceId: "gig-003", title: "Private Sigiriya Rock Fortress & Ancient Village Half-Day", vendor: "Priya Fernando", vendorImg: "/images/traveler3.png", image: "https://images.unsplash.com/photo-1590845947376-2638caa89309?q=80&w=600", rating: 4.8, reviews: 214, price: "12,000", level: "Top Rated", location: "Sigiriya", category: "Nature & Wildlife", savedDate: "Apr 5, 2026" },
            ];
            setWishlist(mockData);
            setLoading(false);
        }, 0);
    }, []);

    const filtered = wishlist.filter((item) => {
        const matchCat = categoryFilter === "All" || item.category === categoryFilter;
        const matchSearch =
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.vendor.toLowerCase().includes(search.toLowerCase()) ||
            item.location.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const removeItem = (id: string) => {
        setRemovingId(id);
        setTimeout(() => {
            setWishlist((prev) => prev.filter((i) => i.id !== id));
            setRemovingId(null);
        }, 300);
    };

    const handleNavClick = (label: string) => {
        clearNavLabel(label);
        setClearedLabels(getClearedLabels());
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            {/* ── Sidebar ── */}
            <TravelerSidebar activePage="Wishlist" />

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-[72px] flex-shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200">
                    <div className="flex-1 max-w-2xl flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200 focus-within:border-[#ff6b35]/50 focus-within:bg-white focus-within:shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#ff6b35]/10">
                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input
                            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none flex-1 font-medium"
                            placeholder="Search your wishlist..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                {/* Category Filter Bar */}
                <div className="h-12 border-b border-slate-100 bg-white px-8 flex items-center space-x-6 overflow-x-auto shrink-0 select-none text-sm font-medium text-slate-500">
                    {categories.map((cat) => (
                        <div
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`cursor-pointer whitespace-nowrap hover:text-slate-900 transition-colors h-full flex items-center border-b-2 ${
                                categoryFilter === cat
                                    ? "text-slate-900 border-[#ff6b35]"
                                    : "border-transparent"
                            }`}
                        >
                            {cat}
                        </div>
                    ))}
                    <div className="ml-auto flex items-center space-x-2 cursor-pointer text-slate-500 hover:text-slate-800 transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Sort</span>
                    </div>
                </div>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="max-w-[1600px] mx-auto">

                        {/* Page heading */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                                    <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                                    <span>My Wishlist</span>
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    {wishlist.length} saved experience{wishlist.length !== 1 ? "s" : ""} · ready to book when you are
                                </p>
                            </div>
                            <Link
                                href="/search"
                                className="flex items-center space-x-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200"
                            >
                                <Compass className="w-4 h-4" />
                                <span>Discover More</span>
                            </Link>
                        </div>

                        {/* Empty State */}
                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
                                    <Heart className="w-9 h-9 text-red-300" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">
                                    {search || categoryFilter !== "All" ? "No matches found" : "Your wishlist is empty"}
                                </h2>
                                <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
                                    {search || categoryFilter !== "All"
                                        ? "Try adjusting your search or category filter."
                                        : "Save experiences you love while browsing and book them later."}
                                </p>
                                <Link
                                    href="/search"
                                    className="flex items-center space-x-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-all"
                                >
                                    <Compass className="w-4 h-4" />
                                    <span>Browse Experiences</span>
                                </Link>
                            </div>
                        )}

                        {/* Gig Grid */}
                        {filtered.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {filtered.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/gig/${item.id}`}
                                        className={`group flex flex-col cursor-pointer transition-all duration-300 ${
                                            removingId === item.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                        }`}
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 border border-slate-100 bg-slate-100">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Overlay actions */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Remove from wishlist */}
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(item.id); }}
                                                className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow-sm z-10 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all"
                                                title="Remove from wishlist"
                                            >
                                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                            </button>

                                            {/* Share */}
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="absolute top-3 left-3 p-1.5 rounded-full bg-black/20 hover:bg-black/30 z-10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                                <Share2 className="w-3.5 h-3.5 text-white" />
                                            </button>

                                            {/* Saved date badge */}
                                            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[10px] font-semibold text-white">
                                                Saved {item.savedDate}
                                            </div>

                                            {/* Location badge */}
                                            <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-slate-700">
                                                <MapPin className="w-2.5 h-2.5 text-[#ff6b35]" />
                                                <span>{item.location}</span>
                                            </div>
                                        </div>

                                        {/* Seller Row */}
                                        <div className="flex items-center space-x-2.5 mb-2 px-1">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-100 overflow-hidden relative shadow-sm flex-shrink-0">
                                                <Image src={item.vendorImg} alt={item.vendor} fill className="object-cover" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-[13px] font-bold text-slate-900 hover:underline leading-none truncate">{item.vendor}</p>
                                                <p className="text-[11px] text-[#ff6b35] font-semibold mt-0.5 leading-none">{item.level}</p>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-sm text-slate-700 leading-snug line-clamp-2 hover:underline mb-2 px-1 font-medium">
                                            {item.title}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-1.5 mb-2.5 px-1 mt-auto">
                                            <div className="flex items-center space-x-0.5">
                                                <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                                                <span className="text-sm font-bold text-slate-900">{item.rating}</span>
                                            </div>
                                            <span className="text-sm text-slate-400">({item.reviews})</span>
                                        </div>

                                        {/* Footer */}
                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                                            <button
                                                className="flex items-center space-x-1.5 text-xs font-semibold text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(item.id); }}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Remove</span>
                                            </button>
                                            <div className="flex items-center space-x-2">
                                                {item.level.includes("Pro") && (
                                                    <span className="flex items-center space-x-0.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm">
                                                        <BadgeCheck className="w-2.5 h-2.5 mr-0.5" /> Pro
                                                    </span>
                                                )}
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Starting At</p>
                                                    <p className="text-base font-black text-slate-900 leading-none">LKR {item.price}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Book Now CTA (hover) */}
                                        <button onClick={(e) => e.preventDefault()} className="mt-2 w-full py-2 text-xs font-bold rounded-xl border border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white transition-all flex items-center justify-center space-x-1.5 opacity-0 group-hover:opacity-100">
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            <span>Book Now</span>
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
