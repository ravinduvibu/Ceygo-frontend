"use client";

import Image from "next/image";
import Link from "next/link";
import {
    LayoutDashboard, Users, ShieldCheck, BarChart3,
    CalendarCheck2, Settings, Star, ChevronRight, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
    { icon: LayoutDashboard, label: "Overview",            href: "/admin" },
    { icon: Users,           label: "User Management",     href: "/usermanagement" },
    { icon: ShieldCheck,     label: "Gig Verification",    href: "/verification" },
    { icon: BarChart3,       label: "Analytics",           href: "/forecasting" },
    { icon: CalendarCheck2,  label: "Bookings",            href: "/bookings" },
    { icon: Star,            label: "Verified Reviews",    href: "/verified-reviews/admin" },
    { icon: Settings,        label: "Settings",            href: "/settings/admin" },
];

interface AdminSidebarProps {
    activePage: string;
}

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
    const { profile, signOut } = useAuth();

    const initials = profile?.full_name
        ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
        : "SA";

    return (
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
                {navItems.map(({ icon: Icon, label, href }) => {
                    const active = label === activePage;
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                active
                                    ? "bg-orange-50 text-[#ff6b35] border border-orange-100 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${active ? "text-[#ff6b35]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span>{label}</span>
                            </div>
                            {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-slate-50 group transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {profile?.full_name ?? "Admin"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{profile?.email ?? ""}</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                        title="Log out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
