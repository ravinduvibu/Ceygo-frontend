"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Plane,
    TrendingUp,
    MapPin,
    Brain,
    RefreshCw,
    Download,
    Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";

// ── Mock Data ─────────────────────────────────────────────
const forecastData = [
    { month: "Apr", kandy: 4200, colombo: 6800, mirissa: 3100, galle: 2900, flight: 7200 },
    { month: "May", kandy: 4900, colombo: 7200, mirissa: 4400, galle: 3500, flight: 8100 },
    { month: "Jun", kandy: 5600, colombo: 8100, mirissa: 5800, galle: 4800, flight: 9400 },
    { month: "Jul", kandy: 6200, colombo: 9300, mirissa: 6500, galle: 5600, flight: 10800 },
    { month: "Aug", kandy: 7100, colombo: 10200, mirissa: 5900, galle: 5100, flight: 11500 },
    { month: "Sep", kandy: 5800, colombo: 8700, mirissa: 4200, galle: 3900, flight: 9700 },
];

const originData = [
    { country: "Germany", value: 18 },
    { country: "UK", value: 22 },
    { country: "India", value: 31 },
    { country: "China", value: 12 },
    { country: "Australia", value: 9 },
    { country: "USA", value: 8 },
];

const regionRadar = [
    { region: "Colombo", demand: 90, capacity: 75, growth: 82 },
    { region: "Kandy", demand: 75, capacity: 60, growth: 70 },
    { region: "Mirissa", demand: 80, capacity: 55, growth: 85 },
    { region: "Galle", demand: 65, capacity: 70, growth: 60 },
    { region: "Nuwara Eliya", demand: 55, capacity: 45, growth: 65 },
    { region: "Sigiriya", demand: 70, capacity: 50, growth: 78 },
];

const modelStats = [
    { label: "SARIMA Accuracy", value: "91.2%", color: "#ff6b35" },
    { label: "LSTM Accuracy", value: "93.7%", color: "#0ea5e9" },
    { label: "Ensemble Score", value: "94.3%", color: "#10b981" },
    { label: "Forecast Horizon", value: "6 months", color: "#8b5cf6" },
];

const regions = ["All Regions", "Colombo", "Kandy", "Mirissa", "Galle"];
const horizons = ["3 months", "6 months", "12 months"];

export default function ForecastingPage() {
    const [showFlight, setShowFlight] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState("All Regions");
    const [selectedHorizon, setSelectedHorizon] = useState("6 months");

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin"
                            className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Back to Dashboard</span>
                        </Link>
                        <span className="text-slate-300">·</span>
                        <div className="flex items-center space-x-2">
                            <div className="relative h-7 w-20">
                                <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                            </div>
                            <span className="text-sm font-bold text-slate-700">AI Forecasting Suite</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition-colors">
                            <RefreshCw className="w-3 h-3" />
                            <span>Refresh Model</span>
                        </button>
                        <button className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                            <Download className="w-3 h-3" />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Page body */}
            <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">

                {/* Title + Controls */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">AI Demand Forecast</h1>
                        <p className="text-sm text-slate-400 mt-0.5 flex items-center space-x-1.5">
                            <Brain className="w-3.5 h-3.5 text-[#ff6b35]" />
                            <span>SARIMA + LSTM Ensemble model · Updated 6 March 2026, 15:52 IST</span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
                            {regions.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setSelectedRegion(r)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${selectedRegion === r
                                            ? "bg-[#ff6b35] text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                            {horizons.map((h) => (
                                <button
                                    key={h}
                                    onClick={() => setSelectedHorizon(h)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${selectedHorizon === h
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Model KPI bar */}
                <div className="grid grid-cols-4 gap-4">
                    {modelStats.map(({ label, value, color }) => (
                        <div key={label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                                <Brain className="w-5 h-5" style={{ color }} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{label}</p>
                                <p className="text-xl font-bold text-slate-900">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main forecast chart */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Upcoming Tourist Arrivals by Region</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Projected volume · Next {selectedHorizon} · {selectedRegion}</p>
                        </div>
                        <button
                            onClick={() => setShowFlight(!showFlight)}
                            className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border ${showFlight
                                    ? "bg-orange-50 text-[#ff6b35] border-orange-200"
                                    : "bg-slate-50 text-slate-400 border-slate-200"
                                }`}
                        >
                            <Plane className="w-3 h-3" />
                            <span>Show Flight Data API</span>
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={380}>
                        <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                {[
                                    ["gKandy2", "#ff6b35"],
                                    ["gColombo2", "#0ea5e9"],
                                    ["gMirissa2", "#10b981"],
                                    ["gGalle2", "#8b5cf6"],
                                ].map(([id, color]) => (
                                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                                labelStyle={{ color: "#64748b", fontWeight: 600 }}
                            />
                            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                            <Area type="monotone" dataKey="kandy" name="Kandy" stroke="#ff6b35" strokeWidth={2.5} fill="url(#gKandy2)" dot={{ r: 4, fill: "#ff6b35", strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="colombo" name="Colombo" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#gColombo2)" dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="mirissa" name="Mirissa" stroke="#10b981" strokeWidth={2.5} fill="url(#gMirissa2)" dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="galle" name="Galle" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gGalle2)" dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }} />
                            {showFlight && (
                                <Area type="monotone" dataKey="flight" name="Flight Arrivals (API)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Secondary charts */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Tourist Origin Breakdown */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-sm font-bold text-slate-900">Tourist Origin Countries</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Projected source market share (next 6 months)</p>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={originData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="country" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                                <Tooltip
                                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }}
                                    formatter={(v) => [`${v}%`, "Market Share"]}
                                />
                                <Bar dataKey="value" name="Market Share" radius={[6, 6, 0, 0]}
                                    fill="#ff6b35"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Regional Demand Radar */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-sm font-bold text-slate-900">Regional Demand Radar</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Demand vs Capacity vs Growth potential by destination</p>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <RadarChart data={regionRadar} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="region" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Demand" dataKey="demand" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.1} strokeWidth={2} />
                                <Radar name="Capacity" dataKey="capacity" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} strokeWidth={2} />
                                <Radar name="Growth" dataKey="growth" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                                <Legend wrapperStyle={{ fontSize: "11px" }} />
                                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Region Insight Cards */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { region: "Colombo", peak: "Jul–Aug", growth: "+18%", index: 90, color: "#0ea5e9", icon: "🏙️" },
                        { region: "Kandy", peak: "Dec–Jan", growth: "+14%", index: 75, color: "#ff6b35", icon: "🏔️" },
                        { region: "Mirissa", peak: "Nov–Mar", growth: "+22%", index: 80, color: "#10b981", icon: "🌊" },
                        { region: "Galle", peak: "Jan–Feb", growth: "+11%", index: 65, color: "#8b5cf6", icon: "🏰" },
                    ].map(({ region, peak, growth, index, color, icon }) => (
                        <div key={region} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xl">{icon}</span>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    {growth}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 mb-0.5">{region}</p>
                            <p className="text-xs text-slate-400 mb-3 flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>Peak: {peak}</span>
                            </p>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${index}%`, background: color }} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">Demand index: {index}/100</p>
                        </div>
                    ))}
                </div>

                {/* Model Info Footer */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-[#ff6b35]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">SARIMA + LSTM Ensemble Model</p>
                                <p className="text-xs text-slate-400">Trained on 5 years of tourism data · last retrained 28 Feb 2026 · Flight API: BIA Arrivals Feed v2</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-semibold text-emerald-600">Model health: Excellent</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
