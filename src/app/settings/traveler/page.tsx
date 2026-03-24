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
    ChevronRight,
    LogOut,
    UserCircle2,
    Bell,
    Globe,
    CreditCard,
    Shield,
    Camera,
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
    { icon: BookOpen, label: "Platform Guide", active: false, count: 0, href: "/guide" },
    { icon: Settings, label: "Settings", active: true, count: 0, href: "/settings/traveler" },
];

export default function TravelerSettings() {
    const [activeTab, setActiveTab] = useState("profile");

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
                        <h1 className="text-lg font-bold text-slate-900">Personal Settings</h1>
                        <p className="text-xs text-slate-400">Manage your profile, preferences, and verified status.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1000px] mx-auto flex space-x-8">
                        {/* Tabs Navigation */}
                        <div className="w-64 flex-shrink-0 space-y-1">
                            {[
                                { id: "profile", label: "Profile", icon: UserCircle2 },
                                { id: "preferences", label: "Preferences", icon: Globe },
                                { id: "notifications", label: "Notifications", icon: Bell },
                                { id: "security", label: "Password & Security", icon: Shield },
                                { id: "payment", label: "Payment Methods", icon: CreditCard },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        activeTab === id
                                            ? "bg-white text-[#ff6b35] shadow-sm border border-slate-200"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Settings Content Pane */}
                        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[600px]">
                            {activeTab === "profile" && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-3xl font-bold text-white shadow-md">
                                                AL
                                            </div>
                                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:text-[#ff6b35] transition-colors shadow-sm">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">Your Avatar</h2>
                                            <p className="text-sm text-slate-400 mt-1">PNG, JPG up to 5MB. Verified users get a badge.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                            <input defaultValue="Alex Müller" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                                            <input defaultValue="traveler@gmail.com" type="email" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" />
                                        </div>
                                        <div className="space-y-1.5 col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Travel Bio</label>
                                            <textarea rows={3} defaultValue="Adventure seeker, culture enthusiast, and mindful traveler." className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <button className="px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab !== "profile" && (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50 select-none animate-in fade-in duration-300">
                                    <LayoutDashboard className="w-12 h-12 text-slate-300" />
                                    <p className="text-slate-500 font-medium">This section is currently under construction.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
