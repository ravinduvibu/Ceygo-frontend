"use client";

import {
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Compass,
    Star,
    BookOpen,
    Settings,
    ChevronRight,
    LogOut,
    Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, count: 0, href: "/dashboard" },
    { icon: Bookmark, label: "My Verified Journeys", active: false, count: 3, href: "/dashboard/My-Verified-Journeys" },
    { icon: MessageSquare, label: "Message Artisan", active: false, count: 2, href: "/messages" },
    { icon: Compass, label: "Find Experiences", active: false, count: 0, href: "/search" },
    { icon: Heart, label: "Wishlist", active: false, count: 0, href: "/wishlist" },
    { icon: Star, label: "Verified Reviews", active: false, count: 0, href: "/verified-reviews/traveler" },
    { icon: BookOpen, label: "Platform Guide", active: true, count: 0, href: "/guide" },
    { icon: Settings, label: "Settings", active: false, count: 0, href: "/settings/traveler" },
];

export default function GuidePage() {
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
                            <div className="flex items-center space-x-1">
                                {count > 0 && (
                                    <span className="text-xs font-bold bg-[#ff6b35]/10 text-[#ff6b35] px-1.5 py-0.5 rounded-full">{count}</span>
                                )}
                                {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                            </div>
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
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Platform Guide</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Learn how to make the most out of your Ceygo experience.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
                        <BookOpen className="w-16 h-16 text-slate-300" />
                        <h2 className="text-lg font-bold text-slate-700">Guide Coming Soon</h2>
                        <p className="text-slate-500 text-sm max-w-sm text-center">
                            We're putting together comprehensive resources on ethical travel, direct payments, and verified safety protocols.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
