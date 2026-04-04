"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    MapPin,
    Star,
    ShieldCheck,
    Navigation,
    Sparkles,
    ChevronLeft,
    Clock,
    Filter,
    X,
    Loader2
} from "lucide-react";

// --- Mock Data ---
interface Vendor {
    id: string;
    title: string;
    category: string;
    distance: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    verified: boolean;
    lat: number;
    lng: number;
}

const vendors: Vendor[] = [
    {
        id: "v1",
        title: "Kumari's Authentic Cooking",
        category: "Experience",
        distance: "0.8 km",
        rating: 4.9,
        reviews: 128,
        price: "LKR 4,500",
        image: "/images/cooking.png",
        verified: true,
        lat: 6.032,
        lng: 80.217,
    },
    {
        id: "v2",
        title: "Saman's Tuk-Tuk Tours",
        category: "Transport",
        distance: "1.2 km",
        rating: 4.7,
        reviews: 84,
        price: "LKR 1,200/hr",
        image: "/images/tuktuk.png",
        verified: true,
        lat: 6.028,
        lng: 80.214,
    },
    {
        id: "v3",
        title: "Galle Fort Heritage Walk",
        category: "Guide",
        distance: "2.5 km",
        rating: 5.0,
        reviews: 312,
        price: "LKR 3,000",
        image: "/images/galle.png",
        verified: true,
        lat: 6.025,
        lng: 80.218,
    },
    {
        id: "v4",
        title: "Ariyaratne Mask Carving",
        category: "Artisan",
        distance: "3.1 km",
        rating: 4.8,
        reviews: 56,
        price: "LKR 2,500",
        image: "/images/mask.png",
        verified: true,
        lat: 6.035,
        lng: 80.222,
    },
];

export default function SearchDiscoveryPage() {
    const [hoveredVenderId, setHoveredVendorId] = useState<string | null>("v2"); // Default highlight for demo
    const [proximitySort, setProximitySort] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Derived state for filtered results
    const filteredVendors = vendors.filter((vendor) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            vendor.title.toLowerCase().includes(query) ||
            vendor.category.toLowerCase().includes(query)
        );
    });

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        
        // Basic validation: Check for special characters that might be harmful or nonsensical
        const specialCharRegex = /[<>{}[]\\^~]/;
        if (specialCharRegex.test(val)) {
            setValidationError("Search contains invalid characters");
        } else if (val.length > 0 && val.length < 2) {
            setValidationError("Please enter at least 2 characters");
        } else {
            setValidationError(null);
        }

        // Simulate a brief searching state for better UX
        if (val.length >= 2 || val.length === 0) {
            setIsSearching(true);
            setTimeout(() => setIsSearching(false), 300);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setValidationError(null);
        setIsSearching(false);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* ── LEFT PANEL (40% Width) : Search & Results ── */}
            <div className="w-full lg:w-[40%] xl:w-[35%] h-full flex flex-col bg-white shadow-[10px_0_30px_-15px_rgba(0,0,0,0.1)] z-20 relative">

                {/* Header & Controls */}
                <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-white">
                    <div className="flex items-center space-x-3 mb-6">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Discover Ceygo</h1>
                    </div>

                    <div className="relative group mb-2">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {isSearching ? (
                                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4 text-emerald-500" />
                            )}
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm ${
                                validationError ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-emerald-500 focus:bg-white"
                            }`}
                            placeholder="Search experiences, drivers, artisans..."
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
                            {searchQuery && (
                                <button 
                                    onClick={clearSearch}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <button className="h-8 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors flex items-center">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Validation Message */}
                    <div className="h-4 mb-4">
                        {validationError && (
                            <p className="text-[10px] font-bold text-red-500 ml-4 animate-in fade-in slide-in-from-top-1">
                                {validationError}
                            </p>
                        )}
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex items-center space-x-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
                        {["Categories", "Price Range", "Ratings"].map((filter) => (
                            <button key={filter} className="flex-shrink-0 flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors shadow-sm">
                                <span>{filter}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        ))}
                    </div>

                    {/* Proximity Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">Sort by Immediate Proximity</p>
                                <p className="text-[10px] text-slate-500">Show verified vendors nearest to me</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setProximitySort(!proximitySort)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${proximitySort ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${proximitySort ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Results Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {searchQuery ? `Results for "${searchQuery}"` : "Verified Local Vendors"}
                        </p>
                        {searchQuery && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                {filteredVendors.length} found
                            </span>
                        )}
                    </div>

                    {filteredVendors.length > 0 ? (
                        filteredVendors.map((vendor) => (
                            <div
                                key={vendor.id}
                                onMouseEnter={() => setHoveredVendorId(vendor.id)}
                                onMouseLeave={() => setHoveredVendorId("v2")} // Revert to default for display purposes
                                className={`flex space-x-4 p-4 rounded-3xl bg-white border transition-all duration-200 cursor-pointer ${hoveredVenderId === vendor.id
                                    ? "border-[#0ea5e9]/40 shadow-md ring-4 ring-[#0ea5e9]/5"
                                    : "border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md"
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                                    <Image src={vendor.image} alt={vendor.title} fill className="object-cover" />
                                    {vendor.verified && (
                                        <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{vendor.category}</span>
                                            <div className="flex items-center text-xs font-bold text-slate-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                                                {vendor.rating} <span className="text-slate-400 font-normal ml-0.5">({vendor.reviews})</span>
                                            </div>
                                        </div>
                                        <h3 className={`text-sm font-bold truncate ${hoveredVenderId === vendor.id ? "text-slate-900" : "text-slate-800"}`}>
                                            {vendor.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center space-x-1 text-slate-500">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{vendor.distance} away</span>
                                        </div>
                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                            {vendor.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-2">No results found</h3>
                            <p className="text-sm text-slate-500 max-w-[240px] mb-8 leading-relaxed">
                                We couldn't find anything matching "<span className="font-bold text-slate-700">{searchQuery}</span>". Try different keywords or filters.
                            </p>
                            <button 
                                onClick={clearSearch}
                                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── RIGHT PANEL (60% Width) : Interactive Map ── */}
            <div className="hidden lg:block w-[60%] xl:w-[65%] h-full relative bg-[#e5e3df] overflow-hidden">

                {/* Simulated Google Map Background (Stylized CSS Grid for mockup purposes since we don't have an API key) */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #f0f0f0 2px, transparent 2px), radial-gradient(circle at 100% 100%, #e0e0e0 2px, transparent 2px)',
                        backgroundSize: '40px 40px',
                        backgroundPosition: '0 0, 20px 20px'
                    }}>
                </div>

                {/* Faux roads for visual texture */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 200 Q 300 150 500 400 T 1000 300" stroke="#94a3b8" strokeWidth="8" fill="none" />
                    <path d="M 200 0 Q 250 300 100 600 T 400 900" stroke="#cbd5e1" strokeWidth="12" fill="none" />
                    <path d="M 800 0 Q 750 400 900 600" stroke="#cbd5e1" strokeWidth="6" fill="none" />
                </svg>

                {/* Map Controls (Top Right) */}
                <div className="absolute top-6 right-6 flex flex-col space-y-2 z-10">
                    <button className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors">
                        <Navigation className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                        <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-100 font-bold">+</button>
                        <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-bold">−</button>
                    </div>
                </div>

                {/* Custom Map Markers */}
                <div className="absolute inset-0 pointer-events-none">

                    {/* Marker 1 */}
                    <div className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-full transform pointer-events-auto cursor-pointer group">
                        <div className={`relative px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 flex items-center justify-center ${hoveredVenderId === 'v1' ? 'bg-[#0ea5e9] text-white scale-110' : 'bg-emerald-500 text-white'}`}>
                            {vendors[0].price.split(' ')[1]}
                            {/* Pointer down triangle */}
                            <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent ${hoveredVenderId === 'v1' ? 'border-t-[#0ea5e9]' : 'border-t-emerald-500'}`} />
                        </div>
                    </div>

                    {/* Marker 2 (Enlarged + Trust Blue as default hover) */}
                    <div className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-full transform pointer-events-auto cursor-pointer z-10">
                        {/* Pulse effect for highlighted marker */}
                        {hoveredVenderId === 'v2' && (
                            <div className="absolute inset-0 bg-[#0ea5e9] rounded-xl animate-ping opacity-20 scale-150" />
                        )}
                        <div className={`relative px-4 py-2 rounded-2xl font-black text-sm shadow-xl transition-all duration-300 flex items-center justify-center space-x-1 border-2 border-white/20 ${hoveredVenderId === 'v2' ? 'bg-[#0ea5e9] text-white scale-110 translate-y-[-8px]' : 'bg-emerald-500 text-white'}`}>
                            {hoveredVenderId === 'v2' && <ShieldCheck className="w-4 h-4 mr-1 text-white fill-white/20" />}
                            <span>{vendors[1].price.split(' ')[1]}</span>
                            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent ${hoveredVenderId === 'v2' ? 'border-t-[#0ea5e9]' : 'border-t-emerald-500'}`} />
                        </div>
                        {/* Popup card preview if hovered */}
                        {hoveredVenderId === 'v2' && (
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2">
                                <p className="text-xs font-bold text-slate-800 truncate mb-1">{vendors[1].title}</p>
                                <div className="flex items-center text-[10px] text-amber-500 font-bold mb-2">
                                    <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> 4.7 <span className="text-slate-400 font-normal ml-1">(84 reviews)</span>
                                </div>
                                <button className="w-full py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold hover:bg-emerald-100 transition-colors">
                                    View Details
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Marker 3 */}
                    <div className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-full transform pointer-events-auto cursor-pointer">
                        <div className={`relative px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 flex items-center justify-center ${hoveredVenderId === 'v3' ? 'bg-[#0ea5e9] text-white scale-110' : 'bg-emerald-500 text-white'}`}>
                            {vendors[2].price.split(' ')[1]}
                            <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent ${hoveredVenderId === 'v3' ? 'border-t-[#0ea5e9]' : 'border-t-emerald-500'}`} />
                        </div>
                    </div>
                    {/* Marker 4 */}
                    <div className="absolute top-[25%] left-[60%] -translate-x-1/2 -translate-y-full transform pointer-events-auto cursor-pointer">
                        <div className={`relative px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 flex items-center justify-center ${hoveredVenderId === 'v4' ? 'bg-[#0ea5e9] text-white scale-110' : 'bg-emerald-500 text-white'}`}>
                            {vendors[3].price.split(' ')[1]}
                            <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent ${hoveredVenderId === 'v4' ? 'border-t-[#0ea5e9]' : 'border-t-emerald-500'}`} />
                        </div>
                    </div>
                </div>

                {/* ── AI Assistant Chat Bubble ── */}
                <button className="absolute bottom-8 right-8 group z-20">
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
