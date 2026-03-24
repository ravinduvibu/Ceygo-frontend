"use client";

import { useState, useRef, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BarChart3,
    CalendarCheck2,
    Activity,
    Settings,
    ChevronRight,
    Search,
    Bell,
    LogOut,
    Star,
    BadgeCheck,
    AlertTriangle,
    Flag,
    X,
    CheckCircle2,
    Lock,
    Filter,
    MessageSquare,
    Trash2,
    Eye,
    Clock,
    TrendingUp,
    EyeOff,
    CheckCheck,
    UserPlus,
    ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────
type VerificationStatus = "Gated ✓" | "Unverified" | "Flagged";
type ModerationStatus = "Live" | "Pending" | "Flagged" | "Removed";

interface Review {
    id: number;
    reviewer: string;
    avatar: string;
    country: string;
    service: string;
    vendor: string;
    rating: number;
    text: string;
    date: string;
    verificationStatus: VerificationStatus;
    moderationStatus: ModerationStatus;
    flagReason?: string;
    transactionId?: string;
}

// ── Mock Reviews ──────────────────────────────────────────
const reviews: Review[] = [
    {
        id: 1,
        reviewer: "Alex Müller",
        avatar: "AM",
        country: "🇩🇪 Germany",
        service: "Anuradhapura Ancient City Cycle Tour",
        vendor: "Thilak's Heritage Cycles",
        rating: 5,
        text: "Absolutely incredible experience. Thilak was knowledgeable, kind, and the bike was in perfect condition. Felt completely safe and truly off the beaten path. 10/10 would recommend!",
        date: "Mar 2, 2026",
        verificationStatus: "Gated ✓",
        moderationStatus: "Live",
        transactionId: "TXN-20260218-4821",
    },
    {
        id: 2,
        reviewer: "Hiroshi Tanaka",
        avatar: "HT",
        country: "🇯🇵 Japan",
        service: "Amma's Southern Cooking Masterclass",
        vendor: "Kumari's Kitchen, Galle",
        rating: 5,
        text: "Kumari's cooking class was the highlight of my 2-week trip. She taught us authentic Sri Lankan techniques and we ate everything we cooked. Wonderful woman, wonderful food.",
        date: "Mar 5, 2026",
        verificationStatus: "Gated ✓",
        moderationStatus: "Live",
        transactionId: "TXN-20260301-5532",
    },
    {
        id: 3,
        reviewer: "Emma Thompson",
        avatar: "ET",
        country: "🇬🇧 UK",
        service: "Sunset TukTuk City Tour – Colombo",
        vendor: "Nuwan's Tuk Experience",
        rating: 4,
        text: "Super fun tour! Nuwan knew every street in Colombo. We'd have given 5 stars but had a minor delay at the start.",
        date: "Mar 4, 2026",
        verificationStatus: "Gated ✓",
        moderationStatus: "Live",
        transactionId: "TXN-20260228-4451",
    },
    {
        id: 4,
        reviewer: "Anonymous User",
        avatar: "AU",
        country: "🌐 Unknown",
        service: "Verified Ethical Elephant Safari",
        vendor: "Saman Wildlife Trust",
        rating: 1,
        text: "WORST experience EVER. Company is a complete scam. Do not book. They took my money and disappeared. Report them.",
        date: "Mar 6, 2026",
        verificationStatus: "Flagged",
        moderationStatus: "Flagged",
        flagReason: "Suspected Fraud — No transaction record found. Language pattern matches known bot network. IP flagged.",
    },
    {
        id: 5,
        reviewer: "Priya Krishnan",
        avatar: "PK",
        country: "🇮🇳 India",
        service: "Traditional Mask Carving Workshop",
        vendor: "Ariyaratne Mask Studio",
        rating: 4,
        text: "Lovely craftsmanship experience. The artisan was patient and friendly. Bought two masks to take home.",
        date: "Feb 28, 2026",
        verificationStatus: "Gated ✓",
        moderationStatus: "Live",
        transactionId: "TXN-20260225-9912",
    },
    {
        id: 6,
        reviewer: "Guest123",
        avatar: "G1",
        country: "🌐 Unknown",
        service: "Nine Arches Bridge Sunrise Hike",
        vendor: "Ella Trek Guide",
        rating: 3,
        text: "It was okay I guess. Guide was late.",
        date: "Mar 1, 2026",
        verificationStatus: "Unverified",
        moderationStatus: "Pending",
    },
];

// ── Star rating display ───────────────────────────────────
function StarRow({ rating }: { rating: number }) {
    return (
        <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className="w-3 h-3"
                    fill={s <= rating ? "#f59e0b" : "transparent"}
                    stroke={s <= rating ? "#f59e0b" : "#d1d5db"}
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
}

// ── Verification badge ────────────────────────────────────
function VerifBadge({ status }: { status: VerificationStatus }) {
    if (status === "Gated ✓") return (
        <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BadgeCheck className="w-3 h-3" />
            <span>Gated Feedback ✓</span>
        </span>
    );
    if (status === "Flagged") return (
        <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
            <Flag className="w-3 h-3" />
            <span>Flagged</span>
        </span>
    );
    return (
        <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            <Lock className="w-3 h-3" />
            <span>Unverified</span>
        </span>
    );
}

// ── Moderation badge ──────────────────────────────────────
function ModBadge({ status }: { status: ModerationStatus }) {
    const map = {
        Live: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Pending: "bg-amber-50 text-amber-600 border-amber-100",
        Flagged: "bg-red-50 text-red-600 border-red-100",
        Removed: "bg-slate-100 text-slate-400 border-slate-200",
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[status]}`}>{status}</span>
    );
}

// ── Sidebar ───────────────────────────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: false, alert: 0, href: "/admin" },
    { icon: Users, label: "User Management", active: false, alert: 0, href: "/usermanagement" },
    { icon: ShieldCheck, label: "Seller Verification", active: false, alert: 7, href: "/verification" },
    { icon: BarChart3, label: "Analytics", active: false, alert: 0, href: "/forecasting" },
    { icon: CalendarCheck2, label: "Bookings", active: false, alert: 0, href: "/bookings" },
    { icon: Star, label: "Verified Reviews", active: true, alert: 1, href: "/verified-reviews/admin" },
    { icon: Settings, label: "Settings", active: false, alert: 0, href: "/settings/admin" },
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
    { id: 1, icon: AlertTriangle, iconColor: "text-red-600",    iconBg: "bg-red-50",    title: "Fraudulent review flagged",   desc: "Anonymous User review on Elephant Safari",  time: "5 min ago",  read: false },
    { id: 2, icon: Clock,        iconColor: "text-amber-600",  iconBg: "bg-amber-50",  title: "Review pending moderation",  desc: "Guest123 — Nine Arches Bridge Sunrise Hike",  time: "22 min ago", read: false },
    { id: 3, icon: ShieldAlert,  iconColor: "text-orange-600", iconBg: "bg-orange-50", title: "Seller verification pending", desc: "3 sellers awaiting audit approval",            time: "1 hr ago",   read: false },
    { id: 4, icon: BadgeCheck,   iconColor: "text-emerald-600",iconBg: "bg-emerald-50",title: "Review approved",             desc: "Alex Müller — Anuradhapura cycle tour",       time: "3 hr ago",   read: true  },
    { id: 5, icon: TrendingUp,   iconColor: "text-blue-600",   iconBg: "bg-blue-50",   title: "Avg. rating hit 4.6★",       desc: "Verified reviews milestone reached",          time: "Yesterday",  read: true  },
];

export default function VerifiedReviewsPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<VerificationStatus | "All">("All");
    const [selectedReview, setSelectedReview] = useState<Review | null>(reviews.find(r => r.moderationStatus === "Flagged") ?? null);
    const [moderationAction, setModerationAction] = useState<string | null>(null);

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

    const filtered = reviews.filter((r) => {
        const matchSearch = r.reviewer.toLowerCase().includes(search.toLowerCase()) ||
            r.service.toLowerCase().includes(search.toLowerCase()) ||
            r.vendor.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filterStatus === "All" || r.verificationStatus === filterStatus;
        return matchSearch && matchFilter;
    });

    const stats = [
        { label: "Total Reviews", value: reviews.length, icon: MessageSquare, color: "text-slate-700", bg: "bg-slate-100" },
        { label: "Gated Feedback ✓", value: reviews.filter(r => r.verificationStatus === "Gated ✓").length, icon: BadgeCheck, color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-100" },
        { label: "Pending Moderation", value: reviews.filter(r => r.moderationStatus === "Pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border border-amber-100" },
        { label: "Flagged Reviews", value: reviews.filter(r => r.moderationStatus === "Flagged").length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 border border-red-100" },
        { label: "Avg. Verified Rating", value: "4.6★", icon: TrendingUp, color: "text-[#ff6b35]", bg: "bg-orange-50 border border-orange-100" },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                    <span className="text-[10px] font-bold text-[#ff6b35] tracking-widest uppercase bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">Admin</span>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, active, alert, href }) => (
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
                            {alert > 0 && (
                                <span className="flex items-center space-x-1">
                                    <span className="text-xs font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">{alert}</span>
                                </span>
                            )}
                            {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            SA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Super Admin</p>
                            <p className="text-xs text-slate-400 truncate">admin@ceygo.lk</p>
                        </div>
                        <Link 
                            href="/" 
                            onClick={() => { document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; }}
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

                {/* Header */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Verified Reviews & Moderation</h1>
                        <p className="text-xs text-slate-400">Transaction-locked trust system · PDPA Compliant</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 w-52">
                            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm placeholder-slate-400 outline-none flex-1" placeholder="Search reviews..." />
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
                                            <button
                                                onClick={markAllRead}
                                                className="flex items-center space-x-1 text-[10px] font-semibold text-slate-400 hover:text-[#ff6b35] transition-colors"
                                            >
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
                                                    <div
                                                        key={n.id}
                                                        className={`flex items-start space-x-3 px-4 py-3 transition-colors group ${n.read ? "bg-white" : "bg-orange-50/40"}`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                            <Icon className={`w-4 h-4 ${n.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <p className={`text-xs font-semibold truncate ${n.read ? "text-slate-600" : "text-slate-900"}`}>{n.title}</p>
                                                                <button
                                                                    onClick={() => dismissNotif(n.id)}
                                                                    className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100 transition-all"
                                                                >
                                                                    <X className="w-3 h-3 text-slate-400" />
                                                                </button>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{n.desc}</p>
                                                            <p className="text-[10px] text-slate-300 mt-1">{n.time}</p>
                                                        </div>
                                                        {!n.read && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                                        <button className="w-full text-[11px] font-semibold text-slate-400 hover:text-[#ff6b35] transition-colors py-1">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-hidden flex">
                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="space-y-4 max-w-[1000px] mx-auto">

                            {/* Stats */}
                            <div className="grid grid-cols-5 gap-3">
                                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                                    <div key={label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3">
                                        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-4 h-4 ${color}`} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-slate-900">{value}</p>
                                            <p className="text-[10px] text-slate-400 leading-tight">{label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Filter tabs */}
                            <div className="flex items-center space-x-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm w-fit">
                                <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
                                {(["All", "Gated ✓", "Flagged", "Unverified"] as const).map(f => (
                                    <button key={f} onClick={() => setFilterStatus(f)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${filterStatus === f ? "bg-[#ff6b35] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                                    >{f}</button>
                                ))}
                            </div>

                            {/* Reviews list */}
                            <div className="space-y-3">
                                {/* Section: Gated Verified first */}
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Verified (Transaction-Locked) Reviews</p>
                                {filtered.filter(r => r.verificationStatus === "Gated ✓").map(review => (
                                    <ReviewCard key={review.id} review={review} selected={selectedReview?.id === review.id} onSelect={() => setSelectedReview(review)} />
                                ))}

                                {filtered.filter(r => r.verificationStatus === "Flagged").length > 0 && (
                                    <>
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-1 pt-2 flex items-center space-x-1.5">
                                            <AlertTriangle className="w-3 h-3" />
                                            <span>Flagged for Moderation</span>
                                        </p>
                                        {filtered.filter(r => r.verificationStatus === "Flagged").map(review => (
                                            <ReviewCard key={review.id} review={review} selected={selectedReview?.id === review.id} onSelect={() => { setSelectedReview(review); setModerationAction(null); }} />
                                        ))}
                                    </>
                                )}

                                {filtered.filter(r => r.verificationStatus === "Unverified").length > 0 && (
                                    <>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 pt-2">Unverified Reviews (Pending)</p>
                                        {filtered.filter(r => r.verificationStatus === "Unverified").map(review => (
                                            <ReviewCard key={review.id} review={review} selected={selectedReview?.id === review.id} onSelect={() => setSelectedReview(review)} />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Moderation Slide-Over ── */}
                    {selectedReview && (
                        <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white shadow-xl flex flex-col overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Active Moderation Panel</h2>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{selectedReview.moderationStatus === "Flagged" ? "⚠️ Requires immediate review" : "Review detail"}</p>
                                </div>
                                <button onClick={() => setSelectedReview(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                                {/* Reviewer info */}
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 flex-shrink-0">
                                        {selectedReview.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">{selectedReview.reviewer}</p>
                                        <p className="text-[10px] text-slate-400">{selectedReview.country} · {selectedReview.date}</p>
                                        <div className="mt-1">
                                            <VerifBadge status={selectedReview.verificationStatus} />
                                        </div>
                                    </div>
                                </div>

                                {/* Service info */}
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Service Reviewed</p>
                                    <p className="text-xs font-semibold text-slate-800">{selectedReview.service}</p>
                                    <p className="text-[10px] text-slate-500">{selectedReview.vendor}</p>
                                    <StarRow rating={selectedReview.rating} />
                                </div>

                                {/* Review text */}
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Review Content</p>
                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        "{selectedReview.text}"
                                    </p>
                                </div>

                                {/* Transaction ID */}
                                {selectedReview.transactionId ? (
                                    <div className="flex items-center space-x-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-700">Transaction Verified</p>
                                            <p className="text-[10px] text-emerald-600 font-mono">{selectedReview.transactionId}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 p-2.5 bg-red-50 rounded-xl border border-red-100">
                                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-red-600">No Transaction Record</p>
                                            <p className="text-[10px] text-red-500">Cannot confirm booking occurred</p>
                                        </div>
                                    </div>
                                )}

                                {/* Flag reason */}
                                {selectedReview.flagReason && (
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide flex items-center space-x-1">
                                            <Flag className="w-3 h-3" /><span>Flag Reason</span>
                                        </p>
                                        <p className="text-xs text-red-600 leading-relaxed bg-red-50 p-3 rounded-xl border border-red-100">
                                            {selectedReview.flagReason}
                                        </p>
                                    </div>
                                )}

                                {/* Moderation status */}
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-500 font-medium">Moderation Status</span>
                                    <ModBadge status={selectedReview.moderationStatus} />
                                </div>
                            </div>

                            {/* Moderation actions */}
                            <div className="px-5 py-4 border-t border-slate-100 space-y-2">
                                {moderationAction ? (
                                    <div className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border text-sm font-semibold ${moderationAction === "approved"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                            : moderationAction === "hidden"
                                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                                : "bg-red-50 text-red-600 border-red-100"
                                        }`}>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{moderationAction === "approved" ? "Review Approved & Live" : moderationAction === "hidden" ? "Review Hidden from Public" : "Review Permanently Removed"}</span>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Moderation Actions</p>
                                        <button onClick={() => setModerationAction("approved")}
                                            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm shadow-emerald-200">
                                            <CheckCircle2 className="w-3.5 h-3.5" /><span>Approve & Keep Live</span>
                                        </button>
                                        <button onClick={() => setModerationAction("hidden")}
                                            className="w-full py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 hover:bg-amber-100 transition-colors flex items-center justify-center space-x-2">
                                            <EyeOff className="w-3.5 h-3.5" /><span>Hide from Public View</span>
                                        </button>
                                        <button onClick={() => setModerationAction("removed")}
                                            className="w-full py-2 rounded-xl bg-slate-50 text-red-500 text-xs font-semibold border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center space-x-2">
                                            <Trash2 className="w-3.5 h-3.5" /><span>Remove Permanently</span>
                                        </button>
                                        <button className="w-full py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-semibold border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2">
                                            <Flag className="w-3.5 h-3.5" /><span>Escalate to Verification Queue</span>
                                        </button>
                                    </>
                                )}
                                {moderationAction && (
                                    <button onClick={() => setModerationAction(null)} className="w-full text-xs text-slate-400 hover:text-slate-600 underline text-center">Reset</button>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// ── Review Card sub-component ─────────────────────────────
function ReviewCard({ review, selected, onSelect }: { review: Review; selected: boolean; onSelect: () => void }) {
    return (
        <div
            onClick={onSelect}
            className={`bg-white rounded-2xl p-4 border shadow-sm cursor-pointer transition-all hover:shadow-md ${selected ? "border-[#ff6b35]/40 ring-2 ring-[#ff6b35]/10" :
                    review.moderationStatus === "Flagged" ? "border-red-200 bg-red-50/30 hover:border-red-300" :
                        review.verificationStatus === "Unverified" ? "border-slate-200 opacity-75" :
                            "border-slate-200 hover:border-slate-300"
                }`}
        >
            <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 flex-shrink-0">
                    {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold text-slate-800">{review.reviewer}</p>
                            <span className="text-[10px] text-slate-400">{review.country}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <StarRow rating={review.rating} />
                            <ModBadge status={review.moderationStatus} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                        <VerifBadge status={review.verificationStatus} />
                        {review.transactionId && (
                            <span className="text-[10px] font-mono text-slate-400">{review.transactionId}</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">"{review.text}"</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-slate-700">{review.service}</p>
                            <p className="text-[10px] text-slate-400">{review.vendor} · {review.date}</p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            {review.moderationStatus === "Flagged" && (
                                <span className="flex items-center space-x-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                    <AlertTriangle className="w-2.5 h-2.5" /><span>Suspected Fraud</span>
                                </span>
                            )}
                            <button className="text-[10px] font-semibold text-[#ff6b35] hover:underline flex items-center space-x-0.5">
                                <Eye className="w-3 h-3" /><span>Review</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
