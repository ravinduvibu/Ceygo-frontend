"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    CalendarCheck2,
    MessageSquare,
    Wallet,
    ChevronRight,
    LogOut,
    Plus,
    Clock,
    CheckCircle2,
    Star,
    MoreHorizontal,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MyServices from "@/components/partner/MyServices";
import ActiveOrders from "@/components/partner/ActiveOrders";
import Inbox from "@/components/partner/Inbox";
import Earnings from "@/components/partner/Earnings";
import CreateServiceModal from "@/components/partner/CreateServiceModal";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ────────────────────────────────────────────────────
interface DashboardService {
    id: string;
    title: string;
    image: string;
    activeOrders: number;
    price: string;
    rating: number;
    reviews: number;
}

interface DisplayOrder {
    id: string;
    buyer: string;
    service: string;
    date: string;
    price: string;
    status: string;
    color: string;
}

interface ApiGig {
    id: string;
    title: string;
    price: number;
    category: string | null;
    rating: number | null;
    reviews_count: number | null;
    orders_count: number | null;
}

interface ApiOrder {
    id: string;
    status: string;
    amount: number;
    created_at: string;
    gigs: { title: string } | null;
    profiles: { full_name: string | null } | null;
}

// ── Helpers ──────────────────────────────────────────────────
const CATEGORY_EMOJI: Record<string, string> = {
    transport: "🚗", guide: "🧭", experience: "✨", artisan: "🎨",
    wellness: "🌿", culinary: "🍛", food: "🍛", heritage: "🏛️",
    adventure: "🏄", nature: "🌿", wildlife: "🦜",
};

function gigEmoji(category: string | null): string {
    const cat = (category ?? "").toLowerCase();
    for (const [key, val] of Object.entries(CATEGORY_EMOJI)) {
        if (cat.includes(key)) return val;
    }
    return "✨";
}

function mapGig(g: ApiGig): DashboardService {
    return {
        id: g.id,
        title: g.title,
        image: gigEmoji(g.category),
        activeOrders: g.orders_count ?? 0,
        price: `LKR ${(g.price).toLocaleString("en-LK")}`,
        rating: g.rating ?? 0,
        reviews: g.reviews_count ?? 0,
    };
}

function mapOrder(o: ApiOrder): DisplayOrder {
    const statusColor: Record<string, string> = { active: "blue", pending: "amber", completed: "emerald", cancelled: "red" };
    const statusLabel: Record<string, string> = { active: "In Progress", pending: "Pending", completed: "Completed", cancelled: "Cancelled" };
    return {
        id: o.id.slice(0, 8).toUpperCase(),
        buyer: o.profiles?.full_name ?? "Traveler",
        service: o.gigs?.title ?? "—",
        date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        price: `LKR ${o.amount.toLocaleString("en-LK")}`,
        status: statusLabel[o.status] ?? o.status,
        color: statusColor[o.status] ?? "slate",
    };
}

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Briefcase,       label: "My Services (Gigs)" },
    { icon: CalendarCheck2,  label: "Active Orders" },
    { icon: MessageSquare,   label: "Inbox" },
    { icon: Wallet,          label: "Earnings" },
];

// ── Main component ───────────────────────────────────────────
function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { profile } = useAuth();

    const tabParam = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(tabParam || "Dashboard");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [gigs, setGigs] = useState<DashboardService[]>([]);
    const [orders, setOrders] = useState<DisplayOrder[]>([]);
    const [loadingGigs, setLoadingGigs] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const fullName = profile?.full_name ?? "Partner";
    const initials = fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

    const fetchGigs = useCallback(async () => {
        setLoadingGigs(true);
        try {
            const res = await fetch("/api/partner/gigs");
            const data = await res.json();
            setGigs(Array.isArray(data) ? data.map(mapGig) : []);
        } finally {
            setLoadingGigs(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch("/api/partner/orders");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data.map(mapOrder) : []);
        } finally {
            setLoadingOrders(false);
        }
    }, []);

    useEffect(() => {
        fetchGigs();
        fetchOrders();
    }, [fetchGigs, fetchOrders]);

    useEffect(() => {
        if (!tabParam && activeTab === "Dashboard") {
            router.replace(`?tab=Dashboard`, { scroll: false });
        }
    }, [tabParam, activeTab, router]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`?tab=${encodeURIComponent(tab)}`, { scroll: false });
    };

    const activeOrdersCount = orders.filter(o => o.status === "In Progress" || o.status === "Pending").length;
    const completedOrders = orders.filter(o => o.status === "Completed").length;
    const completionRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            <CreateServiceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onAddService={() => fetchGigs()}
                onNotify={(msg: string) => console.log(msg)}
                partnerId={profile?.id ?? ""}
            />

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mt-1">
                        Seller
                    </span>
                </div>

                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">My Level</p>
                        <span className="text-xs font-bold text-[#ff6b35]">{gigs.length > 0 ? "Active" : "Getting Started"}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-[#ff6b35] rounded-full" style={{ width: `${Math.min(gigs.length * 20, 100)}%` }} />
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label }) => {
                        const active = activeTab === label;
                        return (
                            <button
                                key={label}
                                onClick={() => handleTabChange(label)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                    active ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-600"}`} />
                                    <span>{label}</span>
                                </div>
                                {active && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f59e0b] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{fullName}</p>
                            <p className="text-xs text-slate-400 truncate">Partner</p>
                        </div>
                        <button
                            onClick={async () => {
                                await fetch("/api/auth/set-role", { method: "DELETE" });
                                window.location.replace("/signin");
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-auto"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Welcome back, {fullName.split(" ")[0]} 👋</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Here&apos;s what&apos;s happening with your business today.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto space-y-6">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: "Total Gigs", value: loadingGigs ? "—" : String(gigs.length), sub: "Published services", icon: Briefcase, color: "emerald" },
                                { label: "Order Completion", value: loadingOrders ? "—" : `${completionRate}%`, sub: "Completed vs total", icon: CheckCircle2, color: "blue" },
                                { label: "Active Orders", value: loadingOrders ? "—" : String(activeOrdersCount), sub: "Pending + in progress", icon: CalendarCheck2, color: "amber" },
                                { label: "Total Orders", value: loadingOrders ? "—" : String(orders.length), sub: "All time", icon: Wallet, color: "orange" },
                            ].map((kpi, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                        <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                                        <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1">{kpi.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === "My Services (Gigs)" ? (
                            <MyServices />
                        ) : activeTab === "Active Orders" ? (
                            <ActiveOrders onNavigateToInbox={() => handleTabChange("Inbox")} />
                        ) : activeTab === "Inbox" ? (
                            <Inbox />
                        ) : activeTab === "Earnings" ? (
                            <Earnings />
                        ) : activeTab === "Dashboard" ? (
                            <div className="grid grid-cols-3 gap-6">

                                {/* Left: Orders + Gigs */}
                                <div className="col-span-2 space-y-6">

                                    {/* Orders Table */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                                                <span>Recent Bookings</span>
                                                {activeOrdersCount > 0 && (
                                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{activeOrdersCount}</span>
                                                )}
                                            </h2>
                                            <button onClick={() => handleTabChange("Active Orders")} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                                                View All Orders
                                            </button>
                                        </div>
                                        <div className="p-0">
                                            {loadingOrders ? (
                                                <div className="py-10 text-center text-sm text-slate-400">Loading orders…</div>
                                            ) : orders.length === 0 ? (
                                                <div className="py-10 text-center text-sm text-slate-400">No orders yet. Share your gig to get your first booking!</div>
                                            ) : (
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                                            <th className="py-3 px-5">Buyer</th>
                                                            <th className="py-3 px-5">Service</th>
                                                            <th className="py-3 px-5">Date</th>
                                                            <th className="py-3 px-5">Total</th>
                                                            <th className="py-3 px-5">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {orders.slice(0, 5).map((order) => (
                                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="py-4 px-5">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                                            {order.buyer.charAt(0)}
                                                                        </div>
                                                                        <span className="text-sm font-semibold text-slate-800">{order.buyer}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-5 text-sm font-medium text-slate-700 max-w-[160px] truncate">{order.service}</td>
                                                                <td className="py-4 px-5 text-xs text-slate-500">{order.date}</td>
                                                                <td className="py-4 px-5 text-sm font-bold text-slate-900">{order.price}</td>
                                                                <td className="py-4 px-5">
                                                                    <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded-md bg-${order.color}-50 text-${order.color}-600 border border-${order.color}-200`}>
                                                                        {order.status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
                                                                        {order.status === "Pending" && <Clock className="w-3 h-3" />}
                                                                        {order.status === "In Progress" && <TrendingUp className="w-3 h-3" />}
                                                                        <span>{order.status}</span>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gigs */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4 mt-2">
                                            <h2 className="text-base font-bold text-slate-900">My Services (Gigs)</h2>
                                            <button
                                                onClick={() => setIsCreateModalOpen(true)}
                                                className="flex items-center space-x-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Create New Service</span>
                                            </button>
                                        </div>
                                        {loadingGigs ? (
                                            <div className="py-10 text-center text-sm text-slate-400">Loading gigs…</div>
                                        ) : gigs.length === 0 ? (
                                            <div className="py-10 text-center bg-white rounded-2xl border border-slate-200">
                                                <p className="text-2xl mb-2">✨</p>
                                                <p className="text-sm font-bold text-slate-700">No services yet</p>
                                                <p className="text-xs text-slate-400 mt-1">Create your first gig to start receiving bookings.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-4">
                                                {gigs.map((svc) => (
                                                    <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
                                                        <Link href={`/gig/${svc.id}`} className="h-32 bg-slate-100 flex items-center justify-center text-5xl border-b border-slate-100 group-hover:bg-emerald-50 transition-colors relative">
                                                            {svc.image}
                                                            <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-sm">View Gig</span>
                                                            </div>
                                                        </Link>
                                                        <div className="p-4 flex flex-col flex-1">
                                                            <Link href={`/gig/${svc.id}`} className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-emerald-600 transition-colors">
                                                                {svc.title}
                                                            </Link>
                                                            <div className="flex items-center justify-between mt-auto pt-4">
                                                                <div className="flex items-center space-x-1">
                                                                    <Star className="w-3.5 h-3.5 fill-[#f59e0b] stroke-[#f59e0b]" />
                                                                    <span className="text-xs font-bold text-amber-500">{svc.rating > 0 ? svc.rating.toFixed(1) : "New"}</span>
                                                                    {svc.reviews > 0 && <span className="text-[10px] text-slate-400">({svc.reviews})</span>}
                                                                </div>
                                                                <span className="text-sm font-black text-slate-900">{svc.price}</span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
                                                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bookings: <span className="text-slate-800">{svc.activeOrders}</span></span>
                                                            <div className="relative group/menu">
                                                                <button className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition-colors">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </button>
                                                                <div className="absolute right-0 bottom-full mb-1 w-36 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all origin-bottom-right z-10">
                                                                    <Link href={`/gig/${svc.id}`} className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                                                        View Gig
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleTabChange("My Services (Gigs)")}
                                                                        className="block w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                                                    >
                                                                        Manage
                                                                    </button>
                                                                    <div className="border-t border-slate-100 my-1" />
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(`${window.location.origin}/gig/${svc.id}`);
                                                                            alert("Gig link copied!");
                                                                        }}
                                                                        className="block w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                                    >
                                                                        Share Link
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Inbox placeholder */}
                                <div className="col-span-1">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[700px]">
                                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                            <h2 className="text-base font-bold text-slate-900">Inbox</h2>
                                            <button onClick={() => handleTabChange("Inbox")} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                                            <MessageSquare className="w-10 h-10 mb-3 text-slate-200" />
                                            <p className="text-sm font-semibold text-slate-500">No messages yet</p>
                                            <p className="text-xs mt-1">Traveler messages will appear here once you receive bookings.</p>
                                        </div>
                                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                                            <button onClick={() => handleTabChange("Inbox")} className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm">
                                                View All Conversations
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                                <p className="text-slate-500">Content for {activeTab} is under construction.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function PartnerDashboard() {
    return (
        <Suspense fallback={<div className="h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
