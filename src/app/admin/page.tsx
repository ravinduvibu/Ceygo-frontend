"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck,
    BarChart3,
    Bell,
    Search,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    FileText,
    ArrowUpRight,
    Users,
    CalendarCheck2,
    Wallet,
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// ── Types ────────────────────────────────────────────────────
interface Stats {
    totalBookings: number;
    verifiedSellers: number;
    pendingVerifications: number;
    activeTourists: number;
}

interface VerificationItem {
    id: string;
    name: string;
    location: string;
    avatar: string;
    score: number;
    approval_status: string | null;
    documents: Record<string, unknown> | null;
}

// ── Forecast data (illustrative — no real ML backend yet) ────
const forecastData = [
    { month: "Apr", kandy: 4200, colombo: 6800, mirissa: 3100 },
    { month: "May", kandy: 4900, colombo: 7200, mirissa: 4400 },
    { month: "Jun", kandy: 5600, colombo: 8100, mirissa: 5800 },
    { month: "Jul", kandy: 6200, colombo: 9300, mirissa: 6500 },
    { month: "Aug", kandy: 7100, colombo: 10200, mirissa: 5900 },
    { month: "Sep", kandy: 5800, colombo: 8700, mirissa: 4200 },
];

// ── Mini sparkline ────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80, h = 36;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <defs>
                <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <polygon points={`0,${h} ${points} ${w},${h}`} fill={`url(#sg-${color.replace("#", "")})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Gauge ─────────────────────────────────────────────────────
function Gauge({ value }: { value: number }) {
    const r = 60, circ = Math.PI * r, progress = (value / 100) * circ;
    return (
        <svg width={160} height={90} viewBox="0 0 160 90">
            <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff6b35" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#e2e8f0" strokeWidth={14} strokeLinecap="round" />
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="url(#gaugeGrad)" strokeWidth={14} strokeLinecap="round"
                strokeDasharray={`${progress} ${circ}`} />
            <text x="80" y="68" textAnchor="middle" fill="#0f172a" fontSize={22} fontWeight="700">{value}%</text>
        </svg>
    );
}

// ── Page ──────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [verifications, setVerifications] = useState<VerificationItem[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, title: "Seller Verification", message: "New partner application submitted.", time: "Just now", read: false, type: "user" },
        { id: 2, title: "High Demand Alert", message: "Ella bookings are up this week.", time: "2h ago", read: false, type: "alert" },
        { id: 3, title: "System", message: "Platform is running normally.", time: "1d ago", read: true, type: "system" },
    ]);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(r => r.json())
            .then(data => { if (!data.error) setStats(data); })
            .catch(() => {});

        fetch("/api/admin/verifications")
            .then(r => r.json())
            .then((data: Array<{
                id: string;
                business_name: string | null;
                location: string | null;
                approval_status: string | null;
                documents: Record<string, unknown> | null;
                profiles: { full_name: string | null } | null;
            }>) => {
                if (!Array.isArray(data)) return;
                const mapped: VerificationItem[] = data
                    .filter(v => v.approval_status === "pending" || v.approval_status === null)
                    .slice(0, 5)
                    .map(v => {
                        const docs = (v.documents ?? {}) as Record<string, unknown>;
                        const hasNic = !!docs.nic_verified;
                        const hasBr = !!docs.br_verified;
                        let score = 40;
                        if (hasNic) score += 25;
                        if (hasBr) score += 25;
                        const name = v.business_name ?? v.profiles?.full_name ?? "Unknown";
                        return {
                            id: v.id,
                            name,
                            location: v.location ?? "Sri Lanka",
                            avatar: name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
                            score,
                            approval_status: v.approval_status,
                            documents: docs,
                        };
                    });
                setVerifications(mapped);
            })
            .catch(() => {});
    }, []);

    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const kpis = [
        {
            label: "Total Bookings",
            value: stats ? stats.totalBookings.toLocaleString() : "—",
            change: "",
            up: true,
            spark: [3, 5, 2, 8, 6, 9, 7],
            color: "#ff6b35",
            icon: CalendarCheck2,
        },
        {
            label: "Verified Sellers",
            value: stats ? stats.verifiedSellers.toLocaleString() : "—",
            change: "",
            up: true,
            spark: [5, 3, 7, 4, 9, 6, 8],
            color: "#0ea5e9",
            icon: ShieldCheck,
        },
        {
            label: "Pending Verifications",
            value: stats ? stats.pendingVerifications.toLocaleString() : "—",
            change: "",
            up: stats ? stats.pendingVerifications === 0 : true,
            spark: [8, 6, 4, 7, 5, 3, 9],
            color: "#f59e0b",
            icon: AlertTriangle,
        },
        {
            label: "Active Travelers",
            value: stats ? stats.activeTourists.toLocaleString() : "—",
            change: "",
            up: true,
            spark: [2, 7, 5, 9, 4, 8, 6],
            color: "#10b981",
            icon: Users,
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            <AdminSidebar activePage="Overview" />

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Control Tower</h1>
                        <p className="text-xs text-slate-400">{new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 w-52">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" placeholder="Search platform..." />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                <Bell className="w-4 h-4 text-slate-500" />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff6b35] rounded-full border-2 border-white" />
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                        <button onClick={markAllAsRead} className="text-xs font-semibold text-[#ff6b35] hover:text-[#e55a2b]">Mark all read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map(n => (
                                            <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex items-start space-x-3 ${!n.read ? "bg-orange-50/30" : ""}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "user" ? "bg-blue-100 text-blue-600" : n.type === "alert" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}>
                                                    {n.type === "user" && <Users className="w-4 h-4" />}
                                                    {n.type === "alert" && <AlertTriangle className="w-4 h-4" />}
                                                    {n.type === "system" && <ShieldCheck className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm truncate ${!n.read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>{n.title}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                                                    <p className="text-[10px] font-semibold text-slate-400 mt-1.5">{n.time}</p>
                                                </div>
                                                {!n.read && <div className="w-2 h-2 bg-[#ff6b35] rounded-full mt-1.5 flex-shrink-0" />}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                                        <button onClick={() => setIsNotificationsOpen(false)} className="text-xs font-bold text-slate-600 hover:text-[#ff6b35]">Close</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto space-y-5">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            {kpis.map(({ label, value, up, spark, color, icon: Icon }) => (
                                <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center space-x-1.5 mb-1">
                                                <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                <p className="text-xs font-medium text-slate-500">{label}</p>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-900">{value}</p>
                                        </div>
                                        <div className="mt-1">
                                            {up
                                                ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                                : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                                            }
                                        </div>
                                    </div>
                                    <Sparkline data={spark} color={color} />
                                </div>
                            ))}
                        </div>

                        {/* Chart + Queue */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Forecast Chart */}
                            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <div className="mb-5">
                                    <h2 className="text-sm font-bold text-slate-900">Demand Forecast: Upcoming Arrivals</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Illustrative projection · Next 6 months</p>
                                </div>
                                <ResponsiveContainer width="100%" height={460}>
                                    <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gKandy" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gColombo" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gMirissa" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }} labelStyle={{ color: "#64748b", fontWeight: 600 }} />
                                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                                        <Area type="monotone" dataKey="kandy" name="Kandy" stroke="#ff6b35" strokeWidth={2} fill="url(#gKandy)" dot={{ r: 3, fill: "#ff6b35" }} />
                                        <Area type="monotone" dataKey="colombo" name="Colombo" stroke="#0ea5e9" strokeWidth={2} fill="url(#gColombo)" dot={{ r: 3, fill: "#0ea5e9" }} />
                                        <Area type="monotone" dataKey="mirissa" name="Mirissa" stroke="#10b981" strokeWidth={2} fill="url(#gMirissa)" dot={{ r: 3, fill: "#10b981" }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center mt-5">
                                    <Link href="/forecasting" className="flex items-center space-x-2 text-sm font-semibold px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200">
                                        <span>Advanced Forecasting</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Verification Queue */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">Manual Review Needed</h2>
                                        <p className="text-xs text-amber-500 mt-0.5 flex items-center space-x-1 font-medium">
                                            <AlertTriangle className="w-3 h-3" />
                                            <span>{stats?.pendingVerifications ?? "—"} pending</span>
                                        </p>
                                    </div>
                                    <ShieldCheck className="w-5 h-5 text-[#ff6b35]" />
                                </div>
                                <div className="space-y-3 flex-1 overflow-y-auto">
                                    {verifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                                            <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-300" />
                                            <p className="text-xs font-semibold text-slate-500">All clear!</p>
                                            <p className="text-xs mt-1">No pending applications right now.</p>
                                        </div>
                                    ) : (
                                        verifications.map(({ id, name, location, avatar, score, documents }) => {
                                            const docs = documents ?? {};
                                            const nic = !!docs.nic_verified;
                                            const biz = !!docs.br_verified;
                                            return (
                                                <div key={id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-all">
                                                    <div className="flex items-center space-x-2.5 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0 border border-slate-200">
                                                            {avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                                                            <p className="text-xs text-slate-400">{location}</p>
                                                        </div>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${score >= 80 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : score >= 60 ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                                                            {score}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-2.5">
                                                        <span className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full font-medium ${nic ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                                            {nic ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                                            <span>NIC</span>
                                                        </span>
                                                        <span className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full font-medium ${biz ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                                            {biz ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                                            <span>Biz Reg</span>
                                                        </span>
                                                    </div>
                                                    <Link href="/verification" className="w-full py-1.5 text-xs font-semibold rounded-lg bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-orange-200">
                                                        <FileText className="w-3 h-3" />
                                                        <span>Review &amp; Grant Shield</span>
                                                    </Link>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Gauge + Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center">
                                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Platform Integrity Score</h2>
                                <p className="text-xs text-slate-400 mb-4 text-center">Verified seller adoption rate</p>
                                <Gauge value={stats && (stats.verifiedSellers + stats.pendingVerifications) > 0
                                    ? Math.round((stats.verifiedSellers / (stats.verifiedSellers + stats.pendingVerifications)) * 100)
                                    : 0}
                                />
                                <p className="text-xs font-semibold text-[#ff6b35] mt-3 text-center">
                                    {stats ? `${stats.verifiedSellers} verified of ${stats.verifiedSellers + stats.pendingVerifications} total` : "Loading…"}
                                </p>
                                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                                    {[
                                        ["Verified", stats?.verifiedSellers ?? "—", "#10b981"],
                                        ["Pending", stats?.pendingVerifications ?? "—", "#f59e0b"],
                                    ].map(([label, val, color]) => (
                                        <div key={String(label)} className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-xs font-bold" style={{ color: String(color) }}>{label}</span>
                                            <span className="text-sm font-bold text-slate-900">{String(val)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-900 mb-4">Platform Overview</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Total Travelers", value: stats ? String(stats.activeTourists) : "—", sub: "Active accounts", good: true },
                                        { label: "Verified Partners", value: stats ? String(stats.verifiedSellers) : "—", sub: "Approved sellers", good: true },
                                        { label: "Pending Review", value: stats ? String(stats.pendingVerifications) : "—", sub: "Awaiting admin", good: stats?.pendingVerifications === 0 },
                                        { label: "Total Bookings", value: stats ? String(stats.totalBookings) : "—", sub: "All time orders", good: true },
                                        { label: "Approval Rate", value: stats && (stats.verifiedSellers + stats.pendingVerifications) > 0 ? `${Math.round((stats.verifiedSellers / (stats.verifiedSellers + stats.pendingVerifications)) * 100)}%` : "—", sub: "Verified vs total", good: true },
                                        { label: "Active Gigs", value: "—", sub: "Published services", good: true, icon: BarChart3 },
                                    ].map(({ label, value, sub, good }) => (
                                        <div key={label} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                                                    <p className="text-lg font-bold text-slate-900">{value}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${good ? "bg-emerald-400" : "bg-red-400"}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <Link href="/usermanagement" className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>Manage Users</span>
                                    </Link>
                                    <Link href="/verification" className="flex items-center space-x-1.5 text-xs font-semibold text-[#ff6b35] hover:text-[#e55a2b] transition-colors">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Review Verifications →</span>
                                    </Link>
                                    <Link href="/forecasting" className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                                        <Wallet className="w-3.5 h-3.5" />
                                        <span>View Analytics</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
