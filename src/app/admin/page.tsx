"use client";

import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BarChart3,
    CalendarCheck2,
    Activity,
    Settings,
    Bell,
    Search,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    FileText,
    LogOut,
    ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
} from "recharts";

// ── Mock Data ──────────────────────────────────────────────
const forecastData = [
    { month: "Apr", kandy: 4200, colombo: 6800, mirissa: 3100, flight: 7200 },
    { month: "May", kandy: 4900, colombo: 7200, mirissa: 4400, flight: 8100 },
    { month: "Jun", kandy: 5600, colombo: 8100, mirissa: 5800, flight: 9400 },
    { month: "Jul", kandy: 6200, colombo: 9300, mirissa: 6500, flight: 10800 },
    { month: "Aug", kandy: 7100, colombo: 10200, mirissa: 5900, flight: 11500 },
    { month: "Sep", kandy: 5800, colombo: 8700, mirissa: 4200, flight: 9700 },
];

const kpiSparkData = [
    [3, 5, 2, 8, 6, 9, 7],
    [5, 3, 7, 4, 9, 6, 8],
    [8, 6, 4, 7, 5, 3, 9],
    [2, 7, 5, 9, 4, 8, 6],
];

const sellers = [
    { name: "Arjuna Perera", location: "Kandy", nic: true, biz: true, avatar: "AP", score: 87 },
    { name: "Sanduni Silva", location: "Colombo", nic: true, biz: false, avatar: "SS", score: 62 },
    { name: "Rajan Nair", location: "Galle", nic: true, biz: true, avatar: "RN", score: 91 },
    { name: "Priya Fernando", location: "Negombo", nic: false, biz: true, avatar: "PF", score: 45 },
];

const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: true, alert: 0 },
    { icon: Users, label: "User Management", active: false, alert: 0 },
    { icon: ShieldCheck, label: "Seller Verification", active: false, alert: 7 },
    { icon: BarChart3, label: "Analytics", active: false, alert: 0 },
    { icon: CalendarCheck2, label: "Bookings", active: false, alert: 0 },
    { icon: Activity, label: "Platform Health", active: false, alert: 0 },
    { icon: Settings, label: "Settings", active: false, alert: 0 },
];

const kpis = [
    { label: "Total Bookings", value: "24,891", change: "+12.4%", up: true, spark: kpiSparkData[0], color: "#ff6b35" },
    { label: "Verified Sellers", value: "1,248", change: "+8.1%", up: true, spark: kpiSparkData[1], color: "#0ea5e9" },
    { label: "Pending Verifications", value: "63", change: "+23.5%", up: false, spark: kpiSparkData[2], color: "#f59e0b" },
    { label: "Active Tourists", value: "9,342", change: "+5.7%", up: true, spark: kpiSparkData[3], color: "#10b981" },
];

// ── Mini sparkline ─────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80;
    const h = 36;
    const points = data
        .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
        .join(" ");
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

// ── Gauge ──────────────────────────────────────────────────
function Gauge({ value }: { value: number }) {
    const r = 60;
    const circ = Math.PI * r;
    const progress = (value / 100) * circ;
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

// ─────────────────────────────────────────────────────────
export default function AdminDashboard() {

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                {/* Logo area */}
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
                    {navItems.map(({ icon: Icon, label, active, alert }) => (
                        <button
                            key={label}
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
                        </button>
                    ))}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            SA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Super Admin</p>
                            <p className="text-xs text-slate-400 truncate">admin@ceygo.lk</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Control Tower</h1>
                        <p className="text-xs text-slate-400">Thursday, 6 March 2026 · 15:52 IST</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 w-52">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" placeholder="Search platform..." />
                        </div>
                        <button className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b35] rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto space-y-5">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            {kpis.map(({ label, value, change, up, spark, color }) => (
                                <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
                                            <p className="text-2xl font-bold text-slate-900">{value}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 mt-1">
                                            {up ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                                            <span className={`text-xs font-semibold ${up ? "text-emerald-500" : "text-red-500"}`}>{change}</span>
                                        </div>
                                    </div>
                                    <Sparkline data={spark} color={color} />
                                </div>
                            ))}
                        </div>

                        {/* Chart + Queue */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* AI Forecast */}
                            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <div className="mb-5">
                                    <h2 className="text-sm font-bold text-slate-900">AI Demand Forecast: Upcoming Arrivals</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">SARIMA + LSTM Ensemble · Next 6 months</p>
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
                                        <Tooltip
                                            contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                                            labelStyle={{ color: "#64748b", fontWeight: 600 }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                                        <Area type="monotone" dataKey="kandy" name="Kandy" stroke="#ff6b35" strokeWidth={2} fill="url(#gKandy)" dot={{ r: 3, fill: "#ff6b35" }} />
                                        <Area type="monotone" dataKey="colombo" name="Colombo" stroke="#0ea5e9" strokeWidth={2} fill="url(#gColombo)" dot={{ r: 3, fill: "#0ea5e9" }} />
                                        <Area type="monotone" dataKey="mirissa" name="Mirissa" stroke="#10b981" strokeWidth={2} fill="url(#gMirissa)" dot={{ r: 3, fill: "#10b981" }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center mt-5">
                                    <Link
                                        href="/forecasting"
                                        className="flex items-center space-x-2 text-sm font-semibold px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200"
                                    >
                                        <span>Advance</span>
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
                                            <span>7 accounts pending</span>
                                        </p>
                                    </div>
                                    <ShieldCheck className="w-5 h-5 text-[#ff6b35]" />
                                </div>
                                <div className="space-y-3 flex-1 overflow-y-auto">
                                    {sellers.map(({ name, location, nic, biz, avatar, score }) => (
                                        <div key={name} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-all">
                                            <div className="flex items-center space-x-2.5 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0 border border-slate-200">
                                                    {avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                                                    <p className="text-xs text-slate-400">{location}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${score >= 80 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                    score >= 60 ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                        "bg-red-50 text-red-500 border border-red-100"
                                                    }`}>
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
                                            <button className="w-full py-1.5 text-xs font-semibold rounded-lg bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-orange-200">
                                                <FileText className="w-3 h-3" />
                                                <span>Review Docs &amp; Grant Shield</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Gauge + Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center">
                                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Leakage Prevention Score</h2>
                                <p className="text-xs text-slate-400 mb-4 text-center">Platform Commission Integrity</p>
                                <Gauge value={92} />
                                <p className="text-xs font-semibold text-[#ff6b35] mt-3 text-center">Incentivized Tier Adoption Rate: 92%</p>
                                <p className="text-xs text-slate-400 mt-1 text-center">Gamified commission tiers · 3 levels</p>
                                <div className="w-full mt-4 grid grid-cols-3 gap-2">
                                    {[["Bronze", "31%", "#cd7f32"], ["Silver", "41%", "#64748b"], ["Gold", "20%", "#f59e0b"]].map(([tier, pct, color]) => (
                                        <div key={tier} className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-xs font-bold" style={{ color }}>{tier}</span>
                                            <span className="text-sm font-bold text-slate-900">{pct}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-900 mb-4">Platform Health Metrics</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "API Response", value: "142ms", sub: "P99 latency", good: true },
                                        { label: "Uptime (30d)", value: "99.97%", sub: "SLA: 99.9%", good: true },
                                        { label: "Failed Txns", value: "0.12%", sub: "of total volume", good: true },
                                        { label: "Fraud Flags (7d)", value: "3", sub: "Under investigation", good: false },
                                        { label: "AI Accuracy", value: "94.3%", sub: "SARIMA+LSTM blend", good: true },
                                        { label: "Avg. Booking", value: "LKR 18.4k", sub: "+6.2% MoM", good: true },
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
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
