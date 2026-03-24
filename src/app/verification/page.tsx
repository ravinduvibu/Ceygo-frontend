"use client";

import { useState } from "react";
import {
    ShieldCheck,
    FileText,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Search,
    Bell,
    ChevronRight,
    LayoutDashboard,
    Users,
    BarChart3,
    CalendarCheck2,
    Activity,
    Settings,
    Star,
    LogOut,
    UserCheck,
    Building2,
    MessageSquare,
    XCircle,
    BadgeCheck,
    ScanLine,
    Link2,
    ClipboardList,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Sidebar nav ───────────────────────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: false, badge: 0, href: "/admin" },
    { icon: Users, label: "User Management", active: false, badge: 0, href: "/usermanagement" },
    { icon: ShieldCheck, label: "Seller Verification", active: true, badge: 148, href: "/verification" },
    { icon: BarChart3, label: "Analytics", active: false, badge: 0, href: "/forecasting" },
    { icon: CalendarCheck2, label: "Bookings", active: false, badge: 0, href: "/bookings" },
    { icon: Star, label: "Verified Reviews", active: false, badge: 1, href: "/verified-reviews/admin" },
    { icon: Settings, label: "Settings", active: false, badge: 0, href: "/settings/admin" },
];

// ── Queue applicants ──────────────────────────────────────
const queue = [
    { id: 1, name: "Sunil's Ayurvedic Retreat", location: "Matara", score: 78, active: true },
    { id: 2, name: "Lanka Bird Watching Tours", location: "Sinharaja", score: 61, active: false },
    { id: 3, name: "Nilusha's Batik Studio", location: "Kandy", score: 55, active: false },
    { id: 4, name: "Ravi's Surf School", location: "Arugam Bay", score: 82, active: false },
];

// ── Timeline steps ────────────────────────────────────────
const timeline = [
    { label: "Submitted", done: true, ts: "Mar 4, 09:12" },
    { label: "Under Review", done: true, ts: "Mar 5, 14:30" },
    { label: "NIC Validated", done: true, ts: "Mar 5, 14:45" },
    { label: "BR Validated", done: true, ts: "Mar 5, 15:02" },
    { label: "Final Admin Decision", done: false, ts: "Awaiting Action" },
];

export default function VerificationPage() {
    const [nicChecked, setNicChecked] = useState(false);
    const [brChecked, setBrChecked] = useState(false);
    const [notes, setNotes] = useState("");
    const [decision, setDecision] = useState<"granted" | "clarify" | "denied" | null>(null);

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
                    {navItems.map(({ icon: Icon, label, active, badge, href }) => (
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
                            <div className="flex items-center space-x-1">
                                {badge > 0 && (
                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                                        {badge}
                                    </span>
                                )}
                                {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Link
                        href="/"
                        onClick={() => { document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; }}
                        className="flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">SA</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Super Admin</p>
                            <p className="text-xs text-slate-400 truncate">admin@ceygo.lk</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </Link>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Verification Audit Workspace</h1>
                        <p className="text-xs text-slate-400">PDPA Compliant · Secure Admin View · 6 March 2026</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 w-48">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" placeholder="Search queue..." />
                        </div>
                        <button className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b35] rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-5 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto flex gap-5 h-full">

                        {/* ── Left Column: Queue + Timeline ── */}
                        <div className="w-60 flex-shrink-0 flex flex-col gap-4">

                            {/* Queue list */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pending Queue</h2>
                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">148</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {queue.map((q) => (
                                        <div
                                            key={q.id}
                                            className={`px-3 py-3 cursor-pointer transition-colors ${q.active ? "bg-orange-50 border-l-2 border-[#ff6b35]" : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <p className={`text-xs font-semibold truncate ${q.active ? "text-[#ff6b35]" : "text-slate-700"}`}>{q.name}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[10px] text-slate-400">{q.location}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${q.score >= 80 ? "bg-emerald-50 text-emerald-600" :
                                                        q.score >= 60 ? "bg-amber-50 text-amber-600" :
                                                            "bg-red-50 text-red-500"
                                                    }`}>{q.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-slate-100">
                                    <button className="text-xs text-[#ff6b35] font-semibold hover:underline">View all 148 →</button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-4">Audit Timeline</h2>
                                <div className="space-y-0">
                                    {timeline.map((step, i) => (
                                        <div key={step.label} className="flex items-start space-x-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-emerald-500" : "bg-slate-200 border-2 border-dashed border-slate-300"
                                                    }`}>
                                                    {step.done
                                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                        : <Clock className="w-3 h-3 text-slate-400" />
                                                    }
                                                </div>
                                                {i < timeline.length - 1 && (
                                                    <div className={`w-0.5 h-7 ${step.done ? "bg-emerald-200" : "bg-slate-100"}`} />
                                                )}
                                            </div>
                                            <div className="pb-5">
                                                <p className={`text-xs font-semibold ${step.done ? "text-slate-800" : "text-slate-400"}`}>{step.label}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{step.ts}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Center: Applicant + Documents ── */}
                        <div className="flex-1 flex flex-col gap-4 min-w-0">

                            {/* Applicant overview */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xl border border-slate-200">
                                            🌿
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h2 className="text-base font-bold text-slate-900">Sunil's Authentic Ayurvedic Retreat</h2>
                                                <span className="text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">Under Review</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5">Seller ID: CYG-2026-04821 · Joined Mar 4, 2026</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                                        <BadgeCheck className="w-3 h-3" />
                                        <span>PDPA Compliant View</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { icon: UserCheck, label: "Applicant", value: "Sunil Bandara" },
                                        { icon: Activity, label: "Location", value: "Matara, Sri Lanka" },
                                        { icon: ClipboardList, label: "Category", value: "Wellness / Ayurveda" },
                                        { icon: Building2, label: "Business Type", value: "Sole Proprietor" },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center space-x-1.5 mb-1">
                                                <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{label}</span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-800">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Document Verification */}
                            <div className="grid grid-cols-2 gap-4">

                                {/* NIC Pane */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <ScanLine className="w-4 h-4 text-[#0ea5e9]" />
                                            <h3 className="text-sm font-bold text-slate-800">National Identity Card (NIC)</h3>
                                        </div>
                                        <span className="text-[10px] font-semibold text-[#0ea5e9] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Uploaded</span>
                                    </div>

                                    {/* Blurred document viewer */}
                                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-100 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
                                        <div className="absolute inset-0 backdrop-blur-sm" />
                                        {/* Simulated document content */}
                                        <div className="relative z-10 text-center space-y-1.5 px-6 w-full">
                                            <div className="h-2.5 bg-slate-400/40 rounded-full w-3/4 mx-auto" />
                                            <div className="h-2 bg-slate-400/30 rounded-full w-full" />
                                            <div className="h-2 bg-slate-400/30 rounded-full w-5/6 mx-auto" />
                                            <div className="h-2 bg-slate-400/30 rounded-full w-full" />
                                            <div className="h-2.5 bg-slate-400/40 rounded-full w-2/3 mx-auto mt-2" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-[9px] font-bold text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                                            🔒 Secure Preview
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Extracted NIC Number</label>
                                            <div className="mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 tracking-widest">
                                                198903601234
                                            </div>
                                        </div>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={nicChecked}
                                                onChange={(e) => setNicChecked(e.target.checked)}
                                                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                                            />
                                            <span className="text-xs text-slate-600 font-medium">Manual Match Confirmed ✓</span>
                                        </label>
                                        {nicChecked && (
                                            <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>NIC identity match confirmed by auditor</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* BR Pane */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-[#8b5cf6]" />
                                            <h3 className="text-sm font-bold text-slate-800">Business Registration (BR)</h3>
                                        </div>
                                        <span className="text-[10px] font-semibold text-[#8b5cf6] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">Uploaded</span>
                                    </div>

                                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-100 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-slate-200" />
                                        <div className="absolute inset-0 backdrop-blur-sm" />
                                        <div className="relative z-10 text-center space-y-1.5 px-6 w-full">
                                            <div className="h-2.5 bg-purple-300/40 rounded-full w-2/3 mx-auto" />
                                            <div className="h-2 bg-slate-400/30 rounded-full w-full" />
                                            <div className="h-2 bg-slate-400/30 rounded-full w-4/5 mx-auto" />
                                            <div className="h-6 w-16 bg-purple-300/30 rounded-lg mx-auto mt-2" />
                                            <div className="h-2 bg-slate-400/30 rounded-full w-full" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-[9px] font-bold text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                                            🔒 Secure Preview
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Extracted BR Number</label>
                                            <div className="mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 tracking-widest">
                                                PV00284751
                                            </div>
                                        </div>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={brChecked}
                                                onChange={(e) => setBrChecked(e.target.checked)}
                                                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                                            />
                                            <span className="text-xs text-slate-600 font-medium">Manual Match Confirmed ✓</span>
                                        </label>
                                        <div className="flex items-center space-x-1.5 text-[10px] font-medium text-[#0ea5e9] bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100">
                                            <Link2 className="w-3 h-3" />
                                            <span>Cross-Ref: <span className="font-bold">API Match</span> — Sri Lanka Dept. of Registrar of Companies ✓</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Right Column: Decision Panel ── */}
                        <div className="w-64 flex-shrink-0 flex flex-col gap-4">

                            {/* Audit score */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Trust Score</h2>
                                <div className="flex items-end space-x-2 mb-2">
                                    <span className="text-4xl font-black text-slate-900">78</span>
                                    <span className="text-sm text-slate-400 mb-1.5">/100</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "78%" }} />
                                </div>
                                <div className="space-y-1.5">
                                    {[
                                        { label: "NIC", ok: true },
                                        { label: "Business Reg.", ok: true },
                                        { label: "Bank Details", ok: false },
                                        { label: "Social Proof", ok: false },
                                    ].map(({ label, ok }) => (
                                        <div key={label} className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500">{label}</span>
                                            {ok
                                                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                : <Clock className="w-3.5 h-3.5 text-slate-300" />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Audit Decision Panel */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex-1 flex flex-col">
                                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Verification Action</h2>

                                {decision ? (
                                    <div className={`flex-1 flex flex-col items-center justify-center text-center p-4 rounded-xl ${decision === "granted" ? "bg-emerald-50 border border-emerald-100" :
                                            decision === "denied" ? "bg-red-50 border border-red-100" :
                                                "bg-amber-50 border border-amber-100"
                                        }`}>
                                        {decision === "granted" && <>
                                            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2" />
                                            <p className="text-sm font-bold text-emerald-700">Verified Shield Granted!</p>
                                            <p className="text-xs text-emerald-600 mt-1">Seller is now verified on the platform.</p>
                                        </>}
                                        {decision === "clarify" && <>
                                            <MessageSquare className="w-10 h-10 text-amber-500 mb-2" />
                                            <p className="text-sm font-bold text-amber-700">Clarification Requested</p>
                                            <p className="text-xs text-amber-600 mt-1">Seller notified to resubmit documents.</p>
                                        </>}
                                        {decision === "denied" && <>
                                            <XCircle className="w-10 h-10 text-red-500 mb-2" />
                                            <p className="text-sm font-bold text-red-700">Application Denied</p>
                                            <p className="text-xs text-red-500 mt-1">Seller has been notified of the outcome.</p>
                                        </>}
                                        <button onClick={() => setDecision(null)} className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline">Reset</button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Audit notes */}
                                        <div className="mb-3 flex-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Internal Audit Notes</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={5}
                                                className="mt-1 w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 resize-none placeholder-slate-400 text-slate-700 transition-all"
                                                placeholder="Add internal notes for audit trail..."
                                            />
                                        </div>

                                        {/* Decision buttons */}
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => setDecision("granted")}
                                                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-sm shadow-emerald-200 flex items-center justify-center space-x-2"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                <span>Grant 'Verified Shield' ✓</span>
                                            </button>
                                            <button
                                                onClick={() => setDecision("clarify")}
                                                className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200 transition-all flex items-center justify-center space-x-1.5"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>Request Clarification</span>
                                            </button>
                                            <button
                                                onClick={() => setDecision("denied")}
                                                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-semibold border border-slate-200 hover:border-red-200 transition-all flex items-center justify-center space-x-1.5"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                <span>Deny Application</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
