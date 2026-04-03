import { useState } from "react";
import { 
    Wallet, 
    ArrowUpRight, 
    ArrowDownRight, 
    Clock, 
    CheckCircle2, 
    Landmark,
    DownloadCloud,
    Filter
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

// Mock Data
const earningsData = [
    { month: "Oct", amount: 12500 },
    { month: "Nov", amount: 18200 },
    { month: "Dec", amount: 24500 },
    { month: "Jan", amount: 21000 },
    { month: "Feb", amount: 38400 },
    { month: "Mar", amount: 42500 }
];

const transactions = [
    { id: "TXN-94821", date: "Mar 25, 2026", type: "Gig Revenue", desc: "Sunset TukTuk Tour (ORD-94281)", amount: "+LKR 2,240", status: "Cleared", statusColor: "emerald" },
    { id: "TXN-94819", date: "Mar 22, 2026", type: "Withdrawal", desc: "Bank Transfer to ****4592", amount: "-LKR 25,000", status: "Completed", statusColor: "slate" },
    { id: "TXN-94750", date: "Mar 20, 2026", type: "Gig Revenue", desc: "Colombo Street Food (ORD-94115)", amount: "+LKR 3,600", status: "Pending Clearance", statusColor: "amber" },
    { id: "TXN-94712", date: "Mar 15, 2026", type: "Gig Revenue", desc: "Safe Drive to Ella (ORD-93990)", amount: "+LKR 12,000", status: "Cleared", statusColor: "emerald" },
    { id: "TXN-94688", date: "Mar 10, 2026", type: "Gig Revenue", desc: "Sunset TukTuk Tour (ORD-93822)", amount: "+LKR 2,240", status: "Cleared", statusColor: "emerald" },
    { id: "TXN-94601", date: "Mar 05, 2026", type: "Withdrawal", desc: "Bank Transfer to ****4592", amount: "-LKR 18,500", status: "Completed", statusColor: "slate" },
];

type WithdrawState = "idle" | "loading" | "success";

export default function Earnings() {
    const [filter, setFilter] = useState("All");
    const [withdrawState, setWithdrawState] = useState<WithdrawState>("idle");

    const handleWithdraw = async () => {
        if (withdrawState !== "idle") return;
        setWithdrawState("loading");
        await new Promise((r) => setTimeout(r, 2600));
        setWithdrawState("success");
    };

    const filteredTransactions = transactions.filter(txn => {
        if (filter === "All") return true;
        if (filter === "Withdrawn") return txn.type === "Withdrawal";
        if (filter === "Pending") return txn.status === "Pending Clearance";
        if (filter === "Cleared") return txn.status === "Cleared";
        return true;
    });

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Earnings</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your finances, track revenue, and withdraw your funds.</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-colors">
                    <DownloadCloud className="w-4 h-4" />
                    <span>Download Statement</span>
                </button>
            </div>

            {/* Financial KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Net Income", value: "LKR 412,500", sub: "Since joining", icon: Wallet, color: "blue", highlight: false },
                    { label: "Withdrawn", value: "LKR 345,000", sub: "Total transferred out", icon: ArrowUpRight, color: "slate", highlight: false },
                    { label: "Pending Clearance", value: "LKR 15,400", sub: "Clearing in 14 days", icon: Clock, color: "amber", highlight: false },
                    { label: "Available for Withdrawal", value: "LKR 52,100", sub: "Ready to transfer", icon: CheckCircle2, color: "emerald", highlight: true },
                ].map((kpi, i) => (
                    <div key={i} className={`p-6 rounded-2xl border shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden ${
                        kpi.highlight 
                            ? "bg-emerald-500 border-emerald-600 text-white" 
                            : "bg-white border-slate-200 text-slate-900"
                    }`}>
                        {/* Background Decoration for Highlighted Card */}
                        {kpi.highlight && (
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl" />
                        )}
                        
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                kpi.highlight ? "bg-white/20 text-white" : `bg-${kpi.color}-50 text-${kpi.color}-500`
                            }`}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                                kpi.highlight ? "text-emerald-50" : "text-slate-500"
                            }`}>{kpi.label}</p>
                            <p className="text-3xl font-black tracking-tight">{kpi.value}</p>
                            <p className={`text-[10px] font-medium mt-1 ${
                                kpi.highlight ? "text-emerald-100" : "text-slate-400"
                            }`}>{kpi.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section: Withdraw Action & Graph */}
            <div className="grid grid-cols-3 gap-6">
                
                {/* Withdraw Component */}
                <div className="col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col overflow-hidden">

                    {/* ── SUCCESS STATE ── */}
                    {withdrawState === "success" ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-5 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Animated circle check */}
                            <div className="relative flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
                                    <svg className="w-9 h-9 text-emerald-500" viewBox="0 0 52 52" fill="none">
                                        <circle cx="26" cy="26" r="24" stroke="#10b981" strokeWidth="3" fill="none"
                                            strokeDasharray="151" strokeDashoffset="0"
                                            style={{ animation: "dash 0.6s ease-out forwards" }}
                                        />
                                        <polyline points="14,26 22,34 38,18" stroke="#10b981" strokeWidth="3.5"
                                            strokeLinecap="round" strokeLinejoin="round" fill="none"
                                            strokeDasharray="40" strokeDashoffset="0"
                                            style={{ animation: "dash 0.4s 0.5s ease-out forwards" }}
                                        />
                                    </svg>
                                </div>
                                {/* Pulse ring */}
                                <div className="absolute w-20 h-20 rounded-full border-2 border-emerald-400 opacity-0"
                                    style={{ animation: "ping 1s 0.4s ease-out 2" }}
                                />
                            </div>

                            <div>
                                <p className="text-base font-black text-slate-900">Request Sent!</p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Your withdrawal of{" "}
                                    <span className="font-bold text-slate-700">LKR 52,100</span>{" "}
                                    is being processed.
                                </p>
                            </div>

                            {/* Bank details pill */}
                            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Landmark className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Commercial Bank</p>
                                        <p className="text-[10px] text-slate-400">**** **** **** 4592</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">Selected</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="w-full space-y-2">
                                {[
                                    { label: "Request received", time: "Just now", done: true },
                                    { label: "Bank processing", time: "1–2 business days", done: false },
                                    { label: "Funds arrive", time: "Within 4 business days", done: false },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                            step.done ? "bg-emerald-500" : "bg-slate-100 border-2 border-slate-200"
                                        }`}>
                                            {step.done && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <p className={`text-xs font-semibold ${ step.done ? "text-slate-700" : "text-slate-400"}`}>{step.label}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{step.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                You&apos;ll receive an email confirmation shortly. Estimated arrival within{" "}
                                <span className="font-bold text-slate-600">4 business days</span>.
                            </p>
                        </div>
                    ) : (
                    /* ── DEFAULT / LOADING STATE ── */
                    <>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Withdraw Balance</h3>
                        <p className="text-xs text-slate-500 mb-6">Transfer your available funds via bank transfer.</p>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                            <p className="text-4xl font-black text-emerald-600">LKR 52,100</p>
                        </div>

                        {/* Bank Transfer — only option */}
                        <div className="mb-6 flex-1">
                            <div className="flex items-center justify-between p-3 border border-emerald-500 bg-emerald-50 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Landmark className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Bank Transfer</p>
                                        <p className="text-xs text-slate-500">**** **** 4592 (Commercial Bank)</p>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full border-4 border-emerald-500 bg-white" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium mt-2 ml-1">
                                Funds will arrive within 4 business days.
                            </p>
                        </div>

                        {/* Withdraw button — Stripe-style loading */}
                        <button
                            onClick={handleWithdraw}
                            disabled={withdrawState === "loading"}
                            className="relative w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-md mt-auto overflow-hidden disabled:cursor-not-allowed"
                        >
                            {/* Stripe shimmer bar */}
                            {withdrawState === "loading" && (
                                <span
                                    className="absolute inset-0 -translate-x-full"
                                    style={{
                                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                                        animation: "shimmer 1.2s infinite",
                                    }}
                                />
                            )}

                            {withdrawState === "loading" ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Withdraw LKR 52,100"
                            )}
                        </button>
                    </>
                    )}

                    <style>{`
                        @keyframes shimmer {
                            0%   { transform: translateX(-100%); }
                            100% { transform: translateX(200%); }
                        }
                        @keyframes dash {
                            from { stroke-dashoffset: 151; }
                            to   { stroke-dashoffset: 0; }
                        }
                        @keyframes ping {
                            0%   { transform: scale(1);   opacity: 0.6; }
                            100% { transform: scale(1.5); opacity: 0; }
                        }
                    `}</style>
                </div>

                {/* Earnings Chart */}
                <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Earnings Over Time</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Your gross revenue over the last 6 months.</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    
                    <div className="h-[280px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(val) => `LKR ${val/1000}k`}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`LKR ${Number(value).toLocaleString()}`, "Revenue"]}
                                />
                                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                    {earningsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === earningsData.length - 1 ? '#10b981' : '#cbd5e1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Transaction History Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Transaction History</h3>
                    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                        {["All", "Pending", "Cleared", "Withdrawn"].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    filter === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="py-4 px-6 font-semibold">Date &amp; ID</th>
                                <th className="py-4 px-6 font-semibold">Type</th>
                                <th className="py-4 px-6 font-semibold">Description</th>
                                <th className="py-4 px-6 font-semibold text-right">Amount</th>
                                <th className="py-4 px-6 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map((txn, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-6 align-middle">
                                        <p className="text-sm font-bold text-slate-900">{txn.date}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{txn.id}</p>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                txn.type === 'Withdrawal' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {txn.type === 'Withdrawal' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{txn.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <p className="text-sm font-medium text-slate-600">{txn.desc}</p>
                                    </td>
                                    <td className="py-4 px-6 align-middle text-right">
                                        <p className={`text-base font-black ${
                                            txn.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'
                                        }`}>{txn.amount}</p>
                                    </td>
                                    <td className="py-4 px-6 align-middle text-right">
                                        <span className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-${txn.statusColor}-50 text-${txn.statusColor}-700 border border-${txn.statusColor}-200`}>
                                            {txn.status === "Pending Clearance" && <Clock className="w-3 h-3" />}
                                            {txn.status === "Cleared" && <CheckCircle2 className="w-3 h-3" />}
                                            {txn.status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
                                            <span>{txn.status}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <Filter className="w-8 h-8 text-slate-300 mb-3" />
                            <p className="text-sm font-bold text-slate-800">No transactions found</p>
                            <p className="text-xs text-slate-500 mt-1">There are no records matching your selected filter.</p>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
}
