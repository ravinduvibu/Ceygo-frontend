"use client";

import { Suspense, useState, useEffect } from "react";
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
    Send
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MyServices from "@/components/partner/MyServices";
import ActiveOrders from "@/components/partner/ActiveOrders";
import Inbox from "@/components/partner/Inbox";
import Earnings from "@/components/partner/Earnings";
import CreateServiceModal from "@/components/partner/CreateServiceModal";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", count: 0 },
    { icon: Briefcase, label: "My Services (Gigs)", count: 0 },
    { icon: CalendarCheck2, label: "Active Orders", count: 3 },
    { icon: MessageSquare, label: "Inbox", count: 5 },
    { icon: Wallet, label: "Earnings", count: 0 },
];

const activeOrders = [
    { id: "ORD-942", buyer: "Elena V.", service: "Sunset TukTuk City Tour", date: "Today, 4:30 PM", price: "LKR 2,800", status: "In Progress", color: "blue" },
    { id: "ORD-943", buyer: "Marco R.", service: "Sunset TukTuk City Tour", date: "Tomorrow, 4:30 PM", price: "LKR 2,800", status: "Pending", color: "amber" },
    { id: "ORD-938", buyer: "David M.", service: "Colombo Local Street Food", date: "Mar 22, 2026", price: "LKR 4,500", status: "Completed", color: "emerald" },
];

const initialDashboardServices = [
    { id: 1, title: "I will take you on a Sunset TukTuk City Tour", image: "🛺", activeOrders: 2, price: "LKR 2,800", rating: 4.8, reviews: 112 },
    { id: 2, title: "I will show you hidden Colombo Street Food", image: "🍛", activeOrders: 0, price: "LKR 4,500", rating: 5.0, reviews: 24 },
    { id: 3, title: "I will drive you to Ella safely (One-way)", image: "🚗", activeOrders: 1, price: "LKR 15,000", rating: 4.9, reviews: 8 },
];

const inboxMessages = [
    { id: 1, sender: "Sarah J.", avatar: "SJ", time: "2m ago", text: "Hi Nuwan! Do you have space for two people tomorrow?", unread: true },
    { id: 2, sender: "Miguel O.", avatar: "MO", time: "1h ago", text: "Thanks for the amazing tour yesterday!", unread: true },
    { id: 3, sender: "Elena V.", avatar: "EV", time: "3h ago", text: "I'll be waiting at the Galle Face Hotel entrance.", unread: false },
    { id: 4, sender: "System", avatar: "🤖", time: "1d ago", text: "Your payout of LKR 24,500 has been processed.", unread: false },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3" fill={s <= Math.round(rating) ? "#f59e0b" : "transparent"} stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"} strokeWidth={1.5} />
            ))}
        </div>
    );
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Initialize tab from URL or fallback to "Dashboard"
    const tabParam = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(tabParam || "Dashboard");
    const [dashboardServices, setDashboardServices] = useState(initialDashboardServices);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Sync tab param if missing on mount
    useEffect(() => {
        // Immediate client-side auth check to prevent bfcache bypassing middleware
        if (!document.cookie.includes('auth=')) {
            window.location.replace('/');
            return;
        }

        if (!tabParam && activeTab === "Dashboard") {
            router.replace(`?tab=Dashboard`, { scroll: false });
        }
    }, [tabParam, activeTab, router]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`?tab=${encodeURIComponent(tab)}`, { scroll: false });
    };

    const handleAddDashboardService = (newSvc: any) => {
        // Map the modal service to dashboard service format
        setDashboardServices([{
            id: newSvc.id,
            title: newSvc.title,
            image: newSvc.emoji || "✨",
            activeOrders: 0,
            price: newSvc.price,
            rating: 0,
            reviews: 0
        }, ...dashboardServices]);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            <CreateServiceModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onAddService={handleAddDashboardService} 
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
                        <span className="text-xs font-bold text-[#ff6b35]">Top Rated</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className="w-full h-full bg-[#ff6b35] rounded-full" />
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, count }) => {
                        const active = activeTab === label;
                        return (
                        <button
                            key={label}
                            onClick={() => handleTabChange(label)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span>{label}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {count > 0 && (
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-600"}`}>{count}</span>
                                )}
                                {active && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                        </button>
                    )})}
                </nav>

                <div className="p-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f59e0b] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            NU
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Nuwan Perera</p>
                            <p className="text-xs text-slate-400 truncate">TukTuk Partner</p>
                        </div>
                        <button 
                            onClick={() => { 
                                document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
                                window.location.replace("/"); 
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
                        <h1 className="text-xl font-bold text-slate-900">Welcome back, Nuwan 👋</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Here's what's happening with your business today.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto space-y-6">

                        {/* Top KPI Header */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: "Inbox Response Rate", value: "100%", sub: "1h avg response time", icon: MessageSquare, color: "emerald" },
                                { label: "Order Completion", value: "98%", sub: "Last 60 days", icon: CheckCircle2, color: "blue" },
                                { label: "Active Orders", value: "3", sub: "LKR 10,100 pending", icon: CalendarCheck2, color: "amber" },
                                { label: "Earned in May", value: "LKR 42,500", sub: "+12% from last month", icon: Wallet, color: "orange" },
                            ].map((kpi, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
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

                        {/* Main Layout Grid */}
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
                            
                            {/* Left Pane: Active Orders & Services */}
                            <div className="col-span-2 space-y-6">
                                
                                {/* Active Orders List */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                                            <span>Active Bookings</span>
                                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">3</span>
                                        </h2>
                                        <button 
                                            onClick={() => handleTabChange("Active Orders")}
                                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                                        >
                                            View All Orders
                                        </button>
                                    </div>
                                    <div className="p-0">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                                    <th className="py-3 px-5">Buyer</th>
                                                    <th className="py-3 px-5">Service (Gig)</th>
                                                    <th className="py-3 px-5">Date/Time</th>
                                                    <th className="py-3 px-5">Total</th>
                                                    <th className="py-3 px-5">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {activeOrders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-4 px-5">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                                    {order.buyer.charAt(0)}
                                                                </div>
                                                                <span className="text-sm font-semibold text-slate-800">{order.buyer}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-5 text-sm font-medium text-slate-700">{order.service}</td>
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
                                    </div>
                                </div>

                                {/* My Services / Gigs */}
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
                                    <div className="grid grid-cols-3 gap-4">
                                        {dashboardServices.map((svc) => (
                                            <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
                                                <Link href="/gig" className="h-32 bg-slate-100 flex items-center justify-center text-5xl border-b border-slate-100 group-hover:bg-emerald-50 transition-colors cursor-pointer relative block">
                                                    {svc.image}
                                                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-sm">View Gig</span>
                                                    </div>
                                                </Link>
                                                <div className="p-4 flex flex-col flex-1">
                                                    <Link href="/gig" className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors">
                                                        {svc.title}
                                                    </Link>
                                                    <div className="flex items-center justify-between mt-auto pt-4">
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="w-3.5 h-3.5 fill-[#f59e0b] stroke-[#f59e0b]" />
                                                            <span className="text-xs font-bold text-amber-500">{svc.rating}</span>
                                                            <span className="text-[10px] text-slate-400">({svc.reviews})</span>
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900">{svc.price}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
                                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Active Bookings: <span className="text-slate-800">{svc.activeOrders}</span></span>
                                                    <div className="relative group/menu">
                                                        <button className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition-colors">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                        {/* Dropdown Menu */}
                                                        <div className="absolute right-0 bottom-full mb-1 w-36 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all origin-bottom-right z-10">
                                                            <Link href="/gig" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-left w-full">
                                                                View Gig
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleTabChange("My Services (Gigs)")}
                                                                className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-left w-full"
                                                            >
                                                                Manage
                                                            </button>
                                                            <div className="border-t border-slate-100 my-1"></div>
                                                            <button 
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText("http://localhost:3000/gig");
                                                                    alert("Gig link copied to clipboard!");
                                                                }}
                                                                className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left w-full"
                                                            >
                                                                Share Link
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            
                            {/* Right Pane: Inbox */}
                            <div className="col-span-1">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[700px]">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                                            <span>Inbox</span>
                                            <span className="text-xs font-bold bg-[#ff6b35] text-white px-1.5 py-0.5 rounded-full">2</span>
                                        </h2>
                                        <button 
                                            onClick={() => handleTabChange("Inbox")}
                                            className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto w-full">
                                        <div className="divide-y divide-slate-100 w-full">
                                            {inboxMessages.map((msg) => (
                                                <div key={msg.id} className={`w-full p-4 cursor-pointer transition-colors ${msg.unread ? "bg-orange-50/30 hover:bg-orange-50/80" : "bg-white hover:bg-slate-50"}`}>
                                                    <div className="flex items-start space-x-3 w-full">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.unread ? "bg-gradient-to-br from-[#ff6b35] to-[#f59e0b] text-white shadow-sm" : "bg-slate-100 text-slate-500"}`}>
                                                            {msg.avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0 pr-1 w-full">
                                                            <div className="flex items-center justify-between mb-0.5 w-full">
                                                                <p className={`text-sm truncate w-full ${msg.unread ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>{msg.sender}</p>
                                                                <span className={`text-[10px] flex-shrink-0 ml-2 ${msg.unread ? "font-bold text-[#ff6b35]" : "font-medium text-slate-400"}`}>{msg.time}</span>
                                                            </div>
                                                            <p className={`text-xs w-full line-clamp-2 ${msg.unread ? "font-semibold text-slate-700" : "text-slate-500"}`}>
                                                                {msg.text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                                        <button 
                                            onClick={() => handleTabChange("Inbox")}
                                            className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm"
                                        >
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
