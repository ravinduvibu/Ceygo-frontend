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
    Bell,
    Search,
    ChevronRight,
    LogOut,
    AlertTriangle,
    Filter,
    Download,
    Eye,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    MapPin,
    User,
    Calendar,
    DollarSign,
    MoreVertical,
    RefreshCw,
    ChevronLeft,
    ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Mock Data ──────────────────────────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: false, alert: 0, href: "/admin" },
    { icon: Users, label: "User Management", active: false, alert: 0, href: "/usermanagement" },
    { icon: ShieldCheck, label: "Seller Verification", active: false, alert: 7, href: "/verification" },
    { icon: BarChart3, label: "Analytics", active: false, alert: 0, href: "/forecasting" },
    { icon: CalendarCheck2, label: "Bookings", active: true, alert: 0, href: "/bookings" },
    { icon: Star, label: "Verified Reviews", active: false, alert: 1, href: "/verified-reviews/admin" },
    { icon: Settings, label: "Settings", active: false, alert: 0, href: "/settings/admin" },
];

const kpiCards = [
    { label: "Total Bookings", value: "24,891", change: "+12.4%", up: true, color: "#ff6b35", icon: CalendarCheck2 },
    { label: "Confirmed", value: "18,542", change: "+8.7%", up: true, color: "#10b981", icon: CheckCircle2 },
    { label: "Pending", value: "4,219", change: "+3.1%", up: false, color: "#f59e0b", icon: Clock },
    { label: "Cancelled", value: "2,130", change: "-1.8%", up: true, color: "#ef4444", icon: XCircle },
];

type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";

const allBookings: {
    id: string;
    tourist: string;
    avatar: string;
    experience: string;
    location: string;
    guide: string;
    date: string;
    amount: string;
    status: BookingStatus;
    payment: string;
    created: string;
}[] = [
    { id: "BK-10291", tourist: "Emily Johnson", avatar: "EJ", experience: "Kandy Cultural Tour", location: "Kandy", guide: "Arjuna Perera", date: "Mar 28, 2026", amount: "LKR 18,500", status: "Confirmed", payment: "Paid", created: "Mar 20" },
    { id: "BK-10290", tourist: "Lucas Müller", avatar: "LM", experience: "Mirissa Whale Watching", location: "Mirissa", guide: "Priya Fernando", date: "Mar 27, 2026", amount: "LKR 24,200", status: "Pending", payment: "Awaiting", created: "Mar 19" },
    { id: "BK-10289", tourist: "Aiko Tanaka", avatar: "AT", experience: "Ella Rock Hike", location: "Ella", guide: "Rajan Nair", date: "Mar 26, 2026", amount: "LKR 12,800", status: "Confirmed", payment: "Paid", created: "Mar 18" },
    { id: "BK-10288", tourist: "Sophie Martin", avatar: "SM", experience: "Colombo City Walk", location: "Colombo", guide: "Sanduni Silva", date: "Mar 25, 2026", amount: "LKR 9,500", status: "Completed", payment: "Paid", created: "Mar 17" },
    { id: "BK-10287", tourist: "Omar Hassan", avatar: "OH", experience: "Sigiriya Sunrise Climb", location: "Sigiriya", guide: "Arjuna Perera", date: "Mar 24, 2026", amount: "LKR 22,000", status: "Cancelled", payment: "Refunded", created: "Mar 16" },
    { id: "BK-10286", tourist: "Clara Dupont", avatar: "CD", experience: "Galle Fort Heritage Walk", location: "Galle", guide: "Priya Fernando", date: "Mar 23, 2026", amount: "LKR 11,200", status: "Confirmed", payment: "Paid", created: "Mar 15" },
    { id: "BK-10285", tourist: "James Wilson", avatar: "JW", experience: "Tea Plantation Visit", location: "Nuwara Eliya", guide: "Rajan Nair", date: "Mar 22, 2026", amount: "LKR 16,400", status: "Pending", payment: "Awaiting", created: "Mar 14" },
    { id: "BK-10284", tourist: "Yuki Sato", avatar: "YS", experience: "Trincomalee Snorkeling", location: "Trincomalee", guide: "Sanduni Silva", date: "Mar 21, 2026", amount: "LKR 19,800", status: "Completed", payment: "Paid", created: "Mar 13" },
    { id: "BK-10283", tourist: "Anna Berg", avatar: "AB", experience: "Yala Safari", location: "Yala", guide: "Arjuna Perera", date: "Mar 20, 2026", amount: "LKR 34,500", status: "Confirmed", payment: "Paid", created: "Mar 12" },
    { id: "BK-10282", tourist: "Raj Patel", avatar: "RP", experience: "Dambulla Cave Temple", location: "Dambulla", guide: "Rajan Nair", date: "Mar 19, 2026", amount: "LKR 8,900", status: "Cancelled", payment: "Refunded", created: "Mar 11" },
];

const statusConfig: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
    Confirmed: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400" },
    Pending:   { bg: "bg-amber-50 border-amber-100",   text: "text-amber-700",   dot: "bg-amber-400"   },
    Cancelled: { bg: "bg-red-50 border-red-100",       text: "text-red-600",     dot: "bg-red-400"     },
    Completed: { bg: "bg-blue-50 border-blue-100",     text: "text-blue-700",    dot: "bg-blue-400"    },
};

const ITEMS_PER_PAGE = 8;

export default function BookingsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [page, setPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    const statuses = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];

    const filtered = allBookings.filter((b) => {
        const matchSearch =
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.tourist.toLowerCase().includes(search.toLowerCase()) ||
            b.experience.toLowerCase().includes(search.toLowerCase()) ||
            b.location.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                {/* Logo */}
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                    <span className="text-[10px] font-bold text-[#ff6b35] tracking-widest uppercase bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                        Admin
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, active, alert, href }) => (
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
                            {alert > 0 && (
                                <span className="text-xs font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">{alert}</span>
                            )}
                            {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                        </Link>
                    ))}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            SA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Super Admin</p>
                            <p className="text-xs text-slate-400 truncate">admin@ceygo.lk</p>
                        </div>
                        <Link
                            href="/"
                            onClick={async () => { await fetch("/api/auth/set-role", { method: "DELETE" }); window.location.replace("/signin"); }}
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

                {/* Top bar */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Bookings</h1>
                        <p className="text-xs text-slate-400">Tuesday, 25 March 2026 · 02:16 IST</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                            <Download className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                        <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                            <Bell className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto space-y-5">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            {kpiCards.map(({ label, value, change, up, color, icon: Icon }) => (
                                <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>
                                        <div className={`flex items-center space-x-1 text-xs font-semibold ${up ? "text-emerald-500" : "text-red-500"}`}>
                                            {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                            <span>{change}</span>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bookings Table Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                            {/* Table Header Controls */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-1">
                                    {statuses.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => { setStatusFilter(s); setPage(1); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                statusFilter === s
                                                    ? "bg-[#ff6b35] text-white shadow-sm shadow-orange-200"
                                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 w-56">
                                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <input
                                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                                            placeholder="Search bookings..."
                                            value={search}
                                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                        />
                                    </div>
                                    <button className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                                        <Filter className="w-3.5 h-3.5" />
                                        <span>Filter</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all" title="Refresh">
                                        <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Booking ID</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Tourist</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Experience</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Date</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Amount</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Payment</th>
                                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {paginated.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center space-y-2 text-slate-400">
                                                        <CalendarCheck2 className="w-8 h-8 opacity-40" />
                                                        <p className="text-sm font-medium">No bookings found</p>
                                                        <p className="text-xs">Try adjusting your filters</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginated.map((booking) => {
                                                const sc = statusConfig[booking.status];
                                                const isSelected = selectedBooking === booking.id;
                                                return (
                                                    <tr
                                                        key={booking.id}
                                                        onClick={() => setSelectedBooking(isSelected ? null : booking.id)}
                                                        className={`cursor-pointer transition-colors hover:bg-orange-50/30 ${isSelected ? "bg-orange-50/50" : ""}`}
                                                    >
                                                        {/* ID */}
                                                        <td className="px-6 py-4">
                                                            <span className="font-mono text-xs font-bold text-[#ff6b35] bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg">
                                                                {booking.id}
                                                            </span>
                                                        </td>

                                                        {/* Tourist */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center space-x-2.5">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0 border border-slate-200">
                                                                    {booking.avatar}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-800 whitespace-nowrap">{booking.tourist}</p>
                                                                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                                                                        <User className="w-3 h-3" />
                                                                        <span>{booking.guide}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Experience */}
                                                        <td className="px-4 py-4">
                                                            <p className="font-medium text-slate-800 whitespace-nowrap">{booking.experience}</p>
                                                            <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                                                                <MapPin className="w-3 h-3" />
                                                                <span>{booking.location}</span>
                                                            </p>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center space-x-1.5 text-slate-700">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="whitespace-nowrap text-sm font-medium">{booking.date}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-400 mt-0.5 ml-5">Created {booking.created}</p>
                                                        </td>

                                                        {/* Amount */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center space-x-1.5">
                                                                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="font-bold text-slate-900 whitespace-nowrap">{booking.amount}</span>
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-4 py-4">
                                                            <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                                <span>{booking.status}</span>
                                                            </span>
                                                        </td>

                                                        {/* Payment */}
                                                        <td className="px-4 py-4">
                                                            <span className={`text-xs font-semibold ${
                                                                booking.payment === "Paid" ? "text-emerald-600" :
                                                                booking.payment === "Refunded" ? "text-red-500" :
                                                                "text-amber-600"
                                                            }`}>
                                                                {booking.payment}
                                                            </span>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center justify-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </button>
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() => setActionMenuOpen(actionMenuOpen === booking.id ? null : booking.id)}
                                                                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
                                                                    >
                                                                        <MoreVertical className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    {actionMenuOpen === booking.id && (
                                                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                                                                            {["Confirm", "Pending", "Cancel", "View Invoice"].map((action) => (
                                                                                <button
                                                                                    key={action}
                                                                                    onClick={() => setActionMenuOpen(null)}
                                                                                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                                                                >
                                                                                    {action}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-xs text-slate-400">
                                    Showing <span className="font-semibold text-slate-700">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}</span>–<span className="font-semibold text-slate-700">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-slate-700">{filtered.length}</span> bookings
                                </p>
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                                page === p
                                                    ? "bg-[#ff6b35] text-white shadow-sm shadow-orange-200"
                                                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages || totalPages === 0}
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Top Experiences */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-900 mb-4">Top Experiences</h2>
                                <div className="space-y-3">
                                    {[
                                        { name: "Yala Safari", bookings: 342, pct: 85 },
                                        { name: "Sigiriya Sunrise", bookings: 284, pct: 70 },
                                        { name: "Mirissa Whales", bookings: 261, pct: 65 },
                                        { name: "Ella Rock Hike", bookings: 198, pct: 49 },
                                    ].map(({ name, bookings, pct }) => (
                                        <div key={name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-medium text-slate-700">{name}</p>
                                                <p className="text-xs font-bold text-slate-500">{bookings}</p>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#ff6b35] to-[#0ea5e9]"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Guides */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-900 mb-4">Top Guides</h2>
                                <div className="space-y-3">
                                    {[
                                        { name: "Arjuna Perera", bookings: 128, rating: "4.9", avatar: "AP" },
                                        { name: "Rajan Nair", bookings: 104, rating: "4.8", avatar: "RN" },
                                        { name: "Sanduni Silva", bookings: 91, rating: "4.7", avatar: "SS" },
                                        { name: "Priya Fernando", bookings: 76, rating: "4.6", avatar: "PF" },
                                    ].map(({ name, bookings, rating, avatar }) => (
                                        <div key={name} className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200 flex-shrink-0">
                                                {avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-800 truncate">{name}</p>
                                                <p className="text-xs text-slate-400">{bookings} bookings</p>
                                            </div>
                                            <div className="flex items-center space-x-0.5 text-xs font-bold text-amber-500">
                                                <Star className="w-3 h-3 fill-amber-400" />
                                                <span>{rating}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Alerts */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-900 mb-4">Booking Alerts</h2>
                                <div className="space-y-3">
                                    {[
                                        { msg: "Ella bookings up 45% this week", type: "up", time: "2h ago" },
                                        { msg: "3 cancellations in Mirissa — high rain forecast", type: "warn", time: "5h ago" },
                                        { msg: "Yala Safari sold out for Mar 28", type: "info", time: "8h ago" },
                                        { msg: "New peak demand: Sigiriya weekend slots", type: "up", time: "1d ago" },
                                    ].map(({ msg, type, time }, i) => (
                                        <div key={i} className={`flex items-start space-x-3 p-2.5 rounded-xl border ${
                                            type === "warn" ? "bg-amber-50 border-amber-100" :
                                            type === "up" ? "bg-emerald-50 border-emerald-100" :
                                            "bg-blue-50 border-blue-100"
                                        }`}>
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                type === "warn" ? "bg-amber-100 text-amber-600" :
                                                type === "up" ? "bg-emerald-100 text-emerald-600" :
                                                "bg-blue-100 text-blue-600"
                                            }`}>
                                                {type === "warn" ? <AlertTriangle className="w-3 h-3" /> :
                                                 type === "up" ? <TrendingUp className="w-3 h-3" /> :
                                                 <CheckCircle2 className="w-3 h-3" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-slate-800 leading-relaxed">{msg}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-semibold">{time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
