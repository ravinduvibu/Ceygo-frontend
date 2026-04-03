"use client";

import {
    Search,
    BadgeCheck,
    PenLine,
    Shield,
    Star,
} from "lucide-react";
import TravelerSidebar from "@/components/TravelerSidebar";

export default function TravelerReviews() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {/* ── Reusable Dynamic Sidebar ── */}
            <TravelerSidebar activePage="Verified Reviews" />

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Your Verified Reviews</h1>
                        <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                            <Shield className="w-3 h-3 text-[#ff6b35]" />
                            <span>Your reviews shape the Ceygo community.</span>
                        </p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[900px] mx-auto space-y-6">
                        {/* Pending Review Cards */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b35]/5 rounded-bl-full -z-0" />
                            <div className="relative z-10 flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 border-b border-[#ff6b35] pb-0.5 inline-block">Pending Reviews</h2>
                                    <p className="text-xs text-slate-400 mt-1">Unlock your next badge by reviewing recent experiences.</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#ff6b35]/30 transition-all group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                                        🛺
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#ff6b35] transition-colors">Sunset TukTuk City Tour</h3>
                                        <p className="text-xs text-slate-500">Nuwan's Tuk Experience · Feb 28, 2026</p>
                                    </div>
                                </div>
                                <button className="flex items-center space-x-1.5 px-4 py-2 bg-[#ff6b35] text-white rounded-lg text-xs font-bold hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200">
                                    <PenLine className="w-3.5 h-3.5" />
                                    <span>Write Review</span>
                                </button>
                            </div>
                        </div>

                        {/* Public Reviews */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-bold text-slate-900">Your Published Reviews</h2>
                                <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 w-52 focus-within:ring-2 ring-[#ff6b35]/10 focus-within:border-[#ff6b35]/30 transition-all">
                                    <Search className="w-4 h-4 text-slate-400" />
                                    <input className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full" placeholder="Search your reviews..." />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
                                                AL
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Anuradhapura Ancient City Cycle Tour</h3>
                                                <p className="text-xs text-slate-500">You reviewed Thilak's Heritage Cycles · Mar 2, 2026</p>
                                            </div>
                                        </div>
                                        <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                            <BadgeCheck className="w-3 h-3" />
                                            <span>Platform Verified ✓</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-0.5 mb-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-3.5 h-3.5" fill="#f59e0b" stroke="#f59e0b" />
                                        ))}
                                        <span className="text-xs font-bold text-amber-500 ml-2">5.0</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        "Absolutely incredible experience. Thilak was knowledgeable, kind, and the bike was in perfect condition. Felt completely safe and truly off the beaten path. 10/10 would recommend!"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
