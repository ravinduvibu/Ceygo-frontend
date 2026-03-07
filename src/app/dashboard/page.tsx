"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Compass,
    Star,
    BookOpen,
    Settings,
    ChevronRight,
    Search,
    Filter,
    Shield,
    Lock,
    CheckCircle2,
    Clock,
    MapPin,
    Bot,
    Send,
    X,
    LogOut,
    ChevronDown,
    Sparkles,
    Users,
} from "lucide-react";
import Image from "next/image";

// ── Mock Data ──────────────────────────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, count: 0 },
    { icon: Bookmark, label: "My Verified Journeys", active: false, count: 3 },
    { icon: MessageSquare, label: "Message Artisan", active: false, count: 2 },
    { icon: Compass, label: "Find Experiences", active: false, count: 0 },
    { icon: Star, label: "Verified Reviews", active: false, count: 0 },
    { icon: BookOpen, label: "Platform Guide", active: false, count: 0 },
    { icon: Settings, label: "Settings", active: false, count: 0 },
];

const journeys = [
    {
        id: 1,
        title: "Anuradhapura Ancient City Cycle Tour",
        vendor: "Thilak's Heritage Cycles",
        date: "Feb 18, 2026",
        status: "Completed",
        category: "Heritage",
        img: "🏛️",
        price: "LKR 4,500",
        rated: false,
    },
    {
        id: 2,
        title: "Amma's Southern Cooking Masterclass",
        vendor: "Kumari's Kitchen, Galle",
        date: "Mar 1, 2026",
        status: "Completed",
        category: "Cookery",
        img: "🍛",
        price: "LKR 3,200",
        rated: true,
    },
    {
        id: 3,
        title: "Kandy Esala Perahera Experience",
        vendor: "Perera Cultural Tours",
        date: "Jul 12, 2026",
        status: "Upcoming",
        category: "Culture",
        img: "🎪",
        price: "LKR 6,800",
        rated: false,
    },
];

const services = [
    {
        id: 1,
        name: "Amma's Southern Sri Lankan Cooking Class",
        vendor: "Kumari Jayawardena",
        location: "Galle Fort",
        category: "Cookery",
        rating: 4.9,
        reviews: 84,
        price: "LKR 3,200",
        emoji: "🍛",
        tag: "Top Pick",
        tagColor: "#ff6b35",
    },
    {
        id: 2,
        name: "Verified Ethical Elephant Safari",
        vendor: "Saman Wildlife Trust",
        location: "Udawalawe",
        category: "Wildlife",
        rating: 4.8,
        reviews: 122,
        price: "LKR 8,500",
        emoji: "🐘",
        tag: "Ethical",
        tagColor: "#10b981",
    },
    {
        id: 3,
        name: "Sunset TukTuk City Tour – Colombo",
        vendor: "Nuwan's Tuk Experience",
        location: "Colombo Fort",
        category: "TukTuk",
        rating: 4.7,
        reviews: 61,
        price: "LKR 2,800",
        emoji: "🛺",
        tag: "No Middlemen",
        tagColor: "#0ea5e9",
    },
    {
        id: 4,
        name: "Traditional Mask Carving Artisan Workshop",
        vendor: "Ariyaratne Mask Studio",
        location: "Ambalangoda",
        category: "Artisan Crafts",
        rating: 4.9,
        reviews: 47,
        price: "LKR 5,100",
        emoji: "🎭",
        tag: "Artisan",
        tagColor: "#8b5cf6",
    },
];

const chatMessages = [
    { from: "ai", text: "Ayubowan! 👋 I'm your AI Sri Lanka Guide. What kind of experience are you looking for today?" },
    { from: "user", text: "Looking for something off the beaten path near Ella." },
    { from: "ai", text: "Great choice! I found a verified local guide offering a private 'Nine Arches Bridge sunrise hike' with a farm breakfast 🌄. Only 3 spots left this week. Want me to book it?" },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className="w-3 h-3"
                    fill={s <= Math.round(rating) ? "#f59e0b" : "transparent"}
                    stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
}

function VerifiedBadge({ size = "sm" }: { size?: "sm" | "md" }) {
    const sz = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
        <span className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            <Shield className={`${sz} text-amber-500`} fill="#f59e0b" fillOpacity={0.2} />
            <span>Verified</span>
        </span>
    );
}

export default function TouristDashboard() {
    const [chatOpen, setChatOpen] = useState(true);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState(chatMessages);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [vibeFilter, setVibeFilter] = useState("All");

    const categories = ["All", "Cookery", "Wildlife", "TukTuk", "Artisan Crafts"];
    const vibes = ["All", "Adventure", "Relational", "Authentic"];

    const handleSend = () => {
        if (!chatInput.trim()) return;
        setMessages((prev) => [...prev, { from: "user", text: chatInput }]);
        setChatInput("");
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { from: "ai", text: "Great! Let me find verified local experiences matching that for you... 🔍" },
            ]);
        }, 800);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, active, count }) => (
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
                            <div className="flex items-center space-x-1">
                                {count > 0 && (
                                    <span className="text-xs font-bold bg-[#ff6b35]/10 text-[#ff6b35] px-1.5 py-0.5 rounded-full">{count}</span>
                                )}
                                {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                            </div>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            AL
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Alex Müller</p>
                            <p className="text-xs text-slate-400 truncate">Traveler · Verified</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Welcome back, Alex! 👋</h1>
                        <p className="text-xs text-slate-400">Start your verified adventure today.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setChatOpen(!chatOpen)}
                            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-semibold border border-[#ff6b35]/20 hover:bg-[#ff6b35]/15 transition-colors"
                        >
                            <Bot className="w-3.5 h-3.5" />
                            <span>AI Guide</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </button>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto space-y-5">

                        {/* Welcome Search Bar */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 flex items-center space-x-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-[#ff6b35]/50 focus-within:ring-2 focus-within:ring-[#ff6b35]/10 transition-all">
                                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <input
                                        className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
                                        placeholder="Search verified local experiences, guides, cooks..."
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Category filter */}
                                    <div className="relative">
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-7 text-xs font-medium text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-colors"
                                        >
                                            {categories.map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                    </div>
                                    {/* Vibe filter */}
                                    <div className="relative">
                                        <select
                                            value={vibeFilter}
                                            onChange={(e) => setVibeFilter(e.target.value)}
                                            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-7 text-xs font-medium text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-colors"
                                        >
                                            {vibes.map((v) => <option key={v}>{v}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                    </div>
                                    <button className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#ff6b35] text-white text-xs font-semibold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                                        <Filter className="w-3 h-3" />
                                        <span>Search</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid: Journeys + Services */}
                        <div className="grid grid-cols-3 gap-5">

                            {/* My Verified Journeys */}
                            <div className="col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">My Verified Journeys</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">Transaction-locked reviews</p>
                                    </div>
                                    <Bookmark className="w-4 h-4 text-[#ff6b35]" />
                                </div>

                                <div className="space-y-3 flex-1 overflow-y-auto">
                                    {journeys.map((j) => (
                                        <div key={j.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-all">
                                            <div className="flex items-start space-x-3 mb-3">
                                                <div className="text-2xl w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    {j.img}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-800 leading-snug">{j.title}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{j.vendor}</p>
                                                    <div className="flex items-center space-x-2 mt-1.5">
                                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${j.status === "Completed"
                                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                                : "bg-blue-50 text-blue-500 border border-blue-100"
                                                            }`}>
                                                            {j.status === "Completed" ? <><CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" />{j.status}</> : <><Clock className="w-2.5 h-2.5 inline mr-0.5" />{j.status}</>}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 flex items-center space-x-0.5">
                                                            <MapPin className="w-2.5 h-2.5" /><span>{j.date}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Review CTA */}
                                            {j.status === "Completed" ? (
                                                j.rated ? (
                                                    <div className="flex items-center justify-center space-x-1 py-1.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-lg">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                        <span>Review Submitted</span>
                                                    </div>
                                                ) : (
                                                    <button className="w-full py-2 text-xs font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-200">
                                                        <Star className="w-3 h-3 fill-white" />
                                                        <span>Leave a Verified Review ✓</span>
                                                    </button>
                                                )
                                            ) : (
                                                <div className="flex items-center justify-center space-x-1.5 py-2 rounded-xl border border-slate-200 bg-slate-100/80">
                                                    <Lock className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[10px] font-medium text-slate-400 italic">Locked · Review only after completion</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Explore Verified Services */}
                            <div className="col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">Explore Verified Local Services</h2>
                                        <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                                            <Sparkles className="w-3 h-3 text-[#ff6b35]" />
                                            <span>AI Matchmaking · Prioritising micro-vendors</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>247 verified providers</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {services.map((s) => (
                                        <div key={s.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-[#ff6b35]/30 hover:shadow-md transition-all group cursor-pointer">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="text-3xl w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                                    {s.emoji}
                                                </div>
                                                <VerifiedBadge />
                                            </div>
                                            <p className="text-xs font-bold text-slate-800 leading-snug mb-0.5">{s.name}</p>
                                            <p className="text-[10px] text-slate-400 mb-2">{s.vendor} · {s.location}</p>

                                            <div className="flex items-center space-x-2 mb-3">
                                                <StarRating rating={s.rating} />
                                                <span className="text-[10px] font-semibold text-slate-600">{s.rating}</span>
                                                <span className="text-[10px] text-slate-400">({s.reviews} reviews)</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{s.price}</p>
                                                    <p className="text-[10px] text-emerald-600 font-medium flex items-center space-x-0.5">
                                                        <Users className="w-2.5 h-2.5" />
                                                        <span>Connect Directly (No Middlemen)</span>
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${s.tagColor}15`, color: s.tagColor }}>
                                                    {s.tag}
                                                </span>
                                            </div>

                                            <button className="mt-3 w-full py-2 text-[11px] font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-[#ff6b35] hover:text-[#ff6b35] transition-all group-hover:border-[#ff6b35] group-hover:text-[#ff6b35]">
                                                Book Directly
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* ── AI Chatbot ── */}
            {chatOpen && (
                <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/50 flex flex-col overflow-hidden z-50">
                    {/* Chat header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e55a2b]">
                        <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-white" />
                            <div>
                                <p className="text-xs font-bold text-white">AI-Powered Sri Lanka Guide</p>
                                <p className="text-[10px] text-orange-100">Beta · Always verified</p>
                            </div>
                        </div>
                        <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-64 bg-slate-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] text-[11px] leading-relaxed px-3 py-2 rounded-xl ${m.from === "user"
                                        ? "bg-[#ff6b35] text-white rounded-tr-sm"
                                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 placeholder-slate-400 transition-all"
                            placeholder="Ask about Sri Lanka..."
                        />
                        <button
                            onClick={handleSend}
                            className="w-8 h-8 rounded-xl bg-[#ff6b35] flex items-center justify-center hover:bg-[#e55a2b] transition-colors flex-shrink-0"
                        >
                            <Send className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
