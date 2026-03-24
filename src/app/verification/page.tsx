"use client";

import { useState, useRef, useEffect } from "react";
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
    CheckCheck,
    X,
    UserPlus,
    TrendingUp,
    Activity,
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

// ── Seller data ───────────────────────────────────────────
interface Seller {
    id: number;
    name: string;
    shortName: string;
    location: string;
    score: number;
    sellerId: string;
    joined: string;
    status: string;
    statusColor: string;
    emoji: string;
    applicant: string;
    category: string;
    businessType: string;
    nicNumber: string;
    brNumber: string;
    timeline: { label: string; done: boolean; ts: string }[];
    scoreBreakdown: { label: string; ok: boolean }[];
}

const sellers: Seller[] = [
    {
        id: 1,
        name: "Sunil's Authentic Ayurvedic Retreat",
        shortName: "Sunil's Ayurvedic Retreat",
        location: "Matara",
        score: 78,
        sellerId: "CYG-2026-04821",
        joined: "Mar 4, 2026",
        status: "Under Review",
        statusColor: "bg-amber-50 border-amber-200 text-amber-700",
        emoji: "🌿",
        applicant: "Sunil Bandara",
        category: "Wellness / Ayurveda",
        businessType: "Sole Proprietor",
        nicNumber: "198903601234",
        brNumber: "PV00284751",
        timeline: [
            { label: "Submitted", done: true, ts: "Mar 4, 09:12" },
            { label: "Under Review", done: true, ts: "Mar 5, 14:30" },
            { label: "NIC Validated", done: true, ts: "Mar 5, 14:45" },
            { label: "BR Validated", done: true, ts: "Mar 5, 15:02" },
            { label: "Final Admin Decision", done: false, ts: "Awaiting Action" },
        ],
        scoreBreakdown: [
            { label: "NIC", ok: true },
            { label: "Business Reg.", ok: true },
            { label: "Bank Details", ok: false },
            { label: "Social Proof", ok: false },
        ],
    },
    {
        id: 2,
        name: "Lanka Bird Watching Tours",
        shortName: "Lanka Bird Watching Tours",
        location: "Sinharaja",
        score: 61,
        sellerId: "CYG-2026-03312",
        joined: "Feb 20, 2026",
        status: "Pending Documents",
        statusColor: "bg-blue-50 border-blue-200 text-blue-700",
        emoji: "🦜",
        applicant: "Chaminda Rathnayake",
        category: "Eco-Tourism / Wildlife",
        businessType: "Partnership",
        nicNumber: "197804501882",
        brNumber: "PV00197623",
        timeline: [
            { label: "Submitted", done: true, ts: "Feb 20, 11:05" },
            { label: "Under Review", done: true, ts: "Feb 21, 09:00" },
            { label: "NIC Validated", done: true, ts: "Feb 21, 09:40" },
            { label: "BR Validated", done: false, ts: "Awaiting Upload" },
            { label: "Final Admin Decision", done: false, ts: "Awaiting Action" },
        ],
        scoreBreakdown: [
            { label: "NIC", ok: true },
            { label: "Business Reg.", ok: false },
            { label: "Bank Details", ok: false },
            { label: "Social Proof", ok: true },
        ],
    },
    {
        id: 3,
        name: "Nilusha's Batik Studio",
        shortName: "Nilusha's Batik Studio",
        location: "Kandy",
        score: 55,
        sellerId: "CYG-2026-02987",
        joined: "Feb 10, 2026",
        status: "Clarification Needed",
        statusColor: "bg-red-50 border-red-200 text-red-700",
        emoji: "🎨",
        applicant: "Nilusha Perera",
        category: "Arts & Crafts",
        businessType: "Sole Proprietor",
        nicNumber: "200105601775",
        brNumber: "PV00341009",
        timeline: [
            { label: "Submitted", done: true, ts: "Feb 10, 08:30" },
            { label: "Under Review", done: true, ts: "Feb 11, 10:15" },
            { label: "NIC Validated", done: false, ts: "Mismatch Detected" },
            { label: "BR Validated", done: false, ts: "Pending" },
            { label: "Final Admin Decision", done: false, ts: "Awaiting Action" },
        ],
        scoreBreakdown: [
            { label: "NIC", ok: false },
            { label: "Business Reg.", ok: true },
            { label: "Bank Details", ok: false },
            { label: "Social Proof", ok: false },
        ],
    },
    {
        id: 4,
        name: "Ravi's Surf School",
        shortName: "Ravi's Surf School",
        location: "Arugam Bay",
        score: 82,
        sellerId: "CYG-2026-05541",
        joined: "Mar 8, 2026",
        status: "Ready for Decision",
        statusColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
        emoji: "🏄",
        applicant: "Ravi Dissanayake",
        category: "Adventure / Water Sports",
        businessType: "Private Company",
        nicNumber: "199512301456",
        brNumber: "PV00412887",
        timeline: [
            { label: "Submitted", done: true, ts: "Mar 8, 07:45" },
            { label: "Under Review", done: true, ts: "Mar 8, 14:00" },
            { label: "NIC Validated", done: true, ts: "Mar 8, 14:20" },
            { label: "BR Validated", done: true, ts: "Mar 8, 14:55" },
            { label: "Final Admin Decision", done: false, ts: "Awaiting Action" },
        ],
        scoreBreakdown: [
            { label: "NIC", ok: true },
            { label: "Business Reg.", ok: true },
            { label: "Bank Details", ok: true },
            { label: "Social Proof", ok: false },
        ],
    },
];

// ── Notification types ───────────────────────────────────
interface Notification {
    id: number;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    title: string;
    desc: string;
    time: string;
    read: boolean;
}

const initialNotifications: Notification[] = [
    { id: 1, icon: AlertTriangle, iconColor: "text-red-600",    iconBg: "bg-red-50",    title: "148 sellers pending review",  desc: "Verification queue is backlogged",           time: "Just now",   read: false },
    { id: 2, icon: UserPlus,     iconColor: "text-blue-600",   iconBg: "bg-blue-50",   title: "New seller application",      desc: "Ravi's Surf School — Arugam Bay",           time: "12 min ago", read: false },
    { id: 3, icon: TrendingUp,   iconColor: "text-emerald-600",iconBg: "bg-emerald-50",title: "Verification granted",         desc: "Lanka Bird Watching Tours approved",         time: "45 min ago", read: false },
    { id: 4, icon: AlertTriangle,iconColor: "text-amber-600",  iconBg: "bg-amber-50",  title: "Document re-submission",      desc: "Nilusha's Batik Studio resubmitted NIC",    time: "2 hr ago",   read: true  },
    { id: 5, icon: ShieldCheck,  iconColor: "text-[#ff6b35]",  iconBg: "bg-orange-50", title: "Trust score updated",         desc: "Sunil's Ayurvedic Retreat — 78/100",        time: "Yesterday",  read: true  },
];

export default function VerificationPage() {
    const [selectedId, setSelectedId] = useState(1);
    const [nicChecked, setNicChecked] = useState(false);
    const [brChecked, setBrChecked] = useState(false);
    const [notes, setNotes] = useState("");
    const [decision, setDecision] = useState<"granted" | "clarify" | "denied" | null>(null);

    const seller = sellers.find(s => s.id === selectedId)!;

    const handleSelectSeller = (id: number) => {
        setSelectedId(id);
        setNicChecked(false);
        setBrChecked(false);
        setNotes("");
        setDecision(null);
    };

    // Notifications
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const dismissNotif = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

    // Score bar colour
    const scoreColor = seller.score >= 80 ? "bg-emerald-400" : seller.score >= 60 ? "bg-amber-400" : "bg-red-400";

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
                        {/* ── Notification Bell ── */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(o => !o)}
                                className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                <Bell className="w-4 h-4 text-slate-500" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#ff6b35] text-white text-[9px] font-bold rounded-full px-1 shadow-sm">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                                        <div className="flex items-center space-x-2">
                                            <Bell className="w-3.5 h-3.5 text-[#ff6b35]" />
                                            <span className="text-sm font-bold text-slate-900">Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-bold bg-[#ff6b35] text-white px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead} className="flex items-center space-x-1 text-[10px] font-semibold text-slate-400 hover:text-[#ff6b35] transition-colors">
                                                <CheckCheck className="w-3 h-3" />
                                                <span>Mark all read</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-50">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                                                <Bell className="w-8 h-8 mb-2" />
                                                <p className="text-xs font-medium">No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map(n => {
                                                const Icon = n.icon;
                                                return (
                                                    <div key={n.id} className={`flex items-start space-x-3 px-4 py-3 transition-colors group ${n.read ? "bg-white" : "bg-orange-50/40"}`}>
                                                        <div className={`w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                            <Icon className={`w-4 h-4 ${n.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <p className={`text-xs font-semibold truncate ${n.read ? "text-slate-600" : "text-slate-900"}`}>{n.title}</p>
                                                                <button onClick={() => dismissNotif(n.id)} className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100 transition-all">
                                                                    <X className="w-3 h-3 text-slate-400" />
                                                                </button>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{n.desc}</p>
                                                            <p className="text-[10px] text-slate-300 mt-1">{n.time}</p>
                                                        </div>
                                                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] flex-shrink-0 mt-1.5" />}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                                        <button className="w-full text-[11px] font-semibold text-slate-400 hover:text-[#ff6b35] transition-colors py-1">View all notifications</button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                                    {sellers.map((q) => (
                                        <button
                                            key={q.id}
                                            onClick={() => handleSelectSeller(q.id)}
                                            className={`w-full text-left px-3 py-3 cursor-pointer transition-all hover:bg-slate-50 ${selectedId === q.id ? "bg-orange-50 border-l-2 border-[#ff6b35]" : "border-l-2 border-transparent"}`}
                                        >
                                            <p className={`text-xs font-semibold truncate ${selectedId === q.id ? "text-[#ff6b35]" : "text-slate-700"}`}>{q.shortName}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[10px] text-slate-400">{q.location}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${q.score >= 80 ? "bg-emerald-50 text-emerald-600" : q.score >= 60 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}>
                                                    {q.score}
                                                </span>
                                            </div>
                                        </button>
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
                                    {seller.timeline.map((step, i) => (
                                        <div key={step.label} className="flex items-start space-x-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-emerald-500" : "bg-slate-200 border-2 border-dashed border-slate-300"}`}>
                                                    {step.done
                                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                        : <Clock className="w-3 h-3 text-slate-400" />
                                                    }
                                                </div>
                                                {i < seller.timeline.length - 1 && (
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
                                            {seller.emoji}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h2 className="text-base font-bold text-slate-900">{seller.name}</h2>
                                                <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${seller.statusColor}`}>{seller.status}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5">Seller ID: {seller.sellerId} · Joined {seller.joined}</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                                        <BadgeCheck className="w-3 h-3" />
                                        <span>PDPA Compliant View</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { icon: UserCheck, label: "Applicant", value: seller.applicant },
                                        { icon: Activity, label: "Location", value: seller.location + ", Sri Lanka" },
                                        { icon: ClipboardList, label: "Category", value: seller.category },
                                        { icon: Building2, label: "Business Type", value: seller.businessType },
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
                                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-100 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
                                        <div className="absolute inset-0 backdrop-blur-sm" />
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
                                                {seller.nicNumber}
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
                                                {seller.brNumber}
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
                                    <span className="text-4xl font-black text-slate-900">{seller.score}</span>
                                    <span className="text-sm text-slate-400 mb-1.5">/100</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                                    <div className={`h-full ${scoreColor} rounded-full transition-all duration-500`} style={{ width: `${seller.score}%` }} />
                                </div>
                                <div className="space-y-1.5">
                                    {seller.scoreBreakdown.map(({ label, ok }) => (
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
