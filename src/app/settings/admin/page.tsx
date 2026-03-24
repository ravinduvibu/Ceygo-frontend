"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BarChart3,
    CalendarCheck2,
    Settings,
    Star,
    ChevronRight,
    LogOut,
    Lock,
    Server
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: false, alert: 0, href: "/admin" },
    { icon: Users, label: "User Management", active: false, alert: 0, href: "/usermanagement" },
    { icon: ShieldCheck, label: "Seller Verification", active: false, alert: 7, href: "/verification" },
    { icon: BarChart3, label: "Analytics", active: false, alert: 0, href: "/forecasting" },
    { icon: CalendarCheck2, label: "Bookings", active: false, alert: 0, href: "/bookings" },
    { icon: Star, label: "Verified Reviews", active: false, alert: 1, href: "/verified-reviews/admin" },
    { icon: Settings, label: "Settings", active: true, alert: 0, href: "/settings/admin" },
];

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                    <span className="text-[10px] font-bold text-[#ff6b35] tracking-widest uppercase bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                        Admin
                    </span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, active, alert, href }) => (
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
                            {alert > 0 && (
                                <span className="flex items-center space-x-1">
                                    <span className="text-xs font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">{alert}</span>
                                </span>
                            )}
                            {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            SA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Super Admin</p>
                            <p className="text-xs text-slate-400 truncate">admin@ceygo.lk</p>
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
                        <h1 className="text-lg font-bold text-slate-900">System Configuration</h1>
                        <p className="text-xs text-slate-400">Configure core platform behaviors and admin policies.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1000px] mx-auto flex space-x-8">
                        {/* Tabs Navigation */}
                        <div className="w-64 flex-shrink-0 space-y-1">
                            {[
                                { id: "general", label: "General Config", icon: Settings },
                                { id: "security", label: "Security Policies", icon: ShieldCheck },
                                { id: "fees", label: "Commission Tiers", icon: Server },
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
                            {activeTab === "general" && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 mb-6">General System Settings</h2>
                                        
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">Maintenance Mode</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">Disables site access for tourists and sellers while active.</p>
                                                </div>
                                                <button className="relative w-12 h-6 rounded-full bg-slate-200 transition-colors pointer-events-none">
                                                    <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform" />
                                                </button>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Admin Email Contact</label>
                                                <input defaultValue="admin@ceygo.lk" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" />
                                            </div>
                                            
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Platform Region Restriction</label>
                                                <select className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800 appearance-none">
                                                    <option>Global (All regions)</option>
                                                    <option>Sri Lanka Focus Mode</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <button className="px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200 flex items-center space-x-2">
                                            <Lock className="w-4 h-4" />
                                            <span>Save & Apply System-wide</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab !== "general" && (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50 select-none animate-in fade-in duration-300">
                                    <Settings className="w-12 h-12 text-slate-300" />
                                    <p className="text-slate-500 font-medium">This section is securely locked or under construction.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
