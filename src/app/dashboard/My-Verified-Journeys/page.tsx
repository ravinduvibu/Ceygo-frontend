"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Compass,
    Star,
    BookOpen,
    Settings,
    LogOut,
    CheckCircle2,
    MapPin,
    Clock,
    Lock,
    Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock Data
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, count: 0, href: "/dashboard" },
    { icon: Bookmark, label: "My Verified Journeys", active: true, count: 3, href: "/dashboard/My-Verified-Journeys" },
    { icon: MessageSquare, label: "Message Artisan", active: false, count: 2, href: "/messages" },
    { icon: Compass, label: "Find Experiences", active: false, count: 0, href: "/search" },
    { icon: Heart, label: "Wishlist", active: false, count: 0, href: "/wishlist" },
    { icon: Star, label: "Verified Reviews", active: false, count: 0, href: "/verified-reviews/traveler" },
    { icon: BookOpen, label: "Platform Guide", active: false, count: 0, href: "/guide" },
    { icon: Settings, label: "Settings", active: false, count: 0, href: "/settings/traveler" },
];

const journeys = [
    {
        id: 1,
        title: "Anuradhapura Ancient City Cycle Tour",
        vendor: "Thilak's Heritage Cycles",
        date: "Feb 18, 2026",
        status: "Completed",
        category: "Heritage",
        img: "🏛️",
        price: "LKR 4,500",
        rated: false,
    },
    {
        id: 2,
        title: "Amma's Southern Cooking Masterclass",
        vendor: "Kumari's Kitchen, Galle",
        date: "Mar 1, 2026",
        status: "Completed",
        category: "Cookery",
        img: "🍛",
        price: "LKR 3,200",
        rated: true,
    },
    {
        id: 3,
        title: "Kandy Esala Perahera Experience",
        vendor: "Perera Cultural Tours",
        date: "Jul 12, 2026",
        status: "Upcoming",
        category: "Culture",
        img: "🎪",
        price: "LKR 6,800",
        rated: false,
    },
];

export default function MyVerifiedJourneysPage() {
    const [hoveredJourney, setHoveredJourney] = useState<number | null>(null);

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
                    {navItems.map(({ icon: Icon, label, active, count, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                ? "bg-orange-50 text-[#ff6b35] border border-orange-100 shadow-sm"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${active ? "text-[#ff6b35]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span>{label}</span>
                            </div>
                            {count > 0 && (
                                <span className="text-xs font-bold bg-[#ff6b35]/10 text-[#ff6b35] px-1.5 py-0.5 rounded-full">{count}</span>
                            )}
                        </Link>
                    ))}
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
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex-shrink-0 flex items-center px-8 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
                            <Bookmark className="w-6 h-6 text-[#ff6b35]" />
                            <span>My Verified Journeys</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5 font-medium">Manage your bookings, access tickets, and leave transaction-locked reviews.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {journeys.map((j) => (
                                <div 
                                    key={j.id} 
                                    onMouseEnter={() => setHoveredJourney(j.id)}
                                    onMouseLeave={() => setHoveredJourney(null)}
                                    className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                                        hoveredJourney === j.id ? 'border-[#ff6b35]/40 shadow-xl shadow-orange-500/5 -translate-y-1' : 'border-slate-200 shadow-sm hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-4xl w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                                                {j.img}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{j.title}</h3>
                                                <p className="text-xs font-semibold text-slate-500">{j.vendor}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 flex justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</p>
                                            <div className={`flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-md w-max ${
                                                j.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                                            }`}>
                                                {j.status === "Completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                <span>{j.status}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 text-right">Date</p>
                                            <div className="flex items-center space-x-1 text-slate-700 text-sm font-semibold">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{j.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {j.status === "Completed" ? (
                                        j.rated ? (
                                            <div className="flex items-center justify-center space-x-2 py-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 text-sm font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Review Published</span>
                                            </div>
                                        ) : (
                                            <button className="w-full flex items-center justify-center space-x-2 py-3 bg-[#ff6b35] text-white rounded-xl shadow-sm hover:bg-[#e55a2b] hover:shadow-md transition-all text-sm font-bold">
                                                <Star className="w-4 h-4 fill-white" />
                                                <span>Leave Verified Review</span>
                                            </button>
                                        )
                                    ) : (
                                        <div className="flex items-center justify-between space-x-3">
                                            <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 transition-colors text-sm font-bold">
                                                View E-Ticket
                                            </button>
                                            <div className="flex items-center justify-center space-x-1 px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-400 text-xs font-bold" title="Review locked until completion">
                                                <Lock className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
