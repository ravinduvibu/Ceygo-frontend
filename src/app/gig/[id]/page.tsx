"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Compass,
    Star,
    BookOpen,
    Settings,
    ChevronRight,
    Heart,
    LogOut,
    MapPin,
    Clock,
    RefreshCw,
    CheckCircle2,
    Shield,
    ChevronLeft,
    ChevronDown,
    BadgeCheck,
    Share2,
    Flag,
    MessageCircle,
    ArrowLeft,
    ShoppingCart,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { gigs } from "../data";

// ── Nav ─────────────────────────────────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard",            active: false, count: 0,  href: "/dashboard" },
    { icon: Bookmark,        label: "My Verified Journeys", active: false, count: 3,  href: "/dashboard/My-Verified-Journeys" },
    { icon: MessageSquare,   label: "Message Artisan",      active: false, count: 2,  href: "/messages" },
    { icon: Compass,         label: "Find Experiences",     active: false, count: 0,  href: "/search" },
    { icon: Heart,           label: "Wishlist",             active: false, count: 0,  href: "/wishlist" },
    { icon: Star,            label: "Verified Reviews",     active: false, count: 0,  href: "/verified-reviews/traveler" },
    { icon: BookOpen,        label: "Platform Guide",       active: false, count: 0,  href: "/guide" },
    { icon: Settings,        label: "Settings",             active: false, count: 0,  href: "/settings/traveler" },
];

const CLEARED_KEY = "ceygo_nav_cleared";
function getClearedLabels(): string[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(CLEARED_KEY) || "[]"); } catch { return []; }
}
function clearNavLabel(label: string) {
    const cleared = getClearedLabels();
    if (!cleared.includes(label)) {
        localStorage.setItem(CLEARED_KEY, JSON.stringify([...cleared, label]));
    }
}

// ── Order Modal ──────────────────────────────────────────────
function OrderModal({ pkg, gigTitle, onClose }: { pkg: { name: string; price: number; description: string; delivery: string; includes: string[] }; gigTitle: string; onClose: () => void }) {
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [note, setNote] = useState("");
    const [ordered, setOrdered] = useState(false);

    const handleOrder = () => {
        if (!date) return;
        setOrdered(true);
    };

    if (ordered) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-1">
                        Your <span className="font-bold text-slate-800">{pkg.name}</span> package has been booked.
                    </p>
                    <p className="text-slate-400 text-xs mb-6">Date: <span className="font-semibold text-slate-700">{date}</span> · {guests} guest{guests > 1 ? "s" : ""}</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Summary</p>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">{gigTitle}</p>
                        <p className="text-sm text-slate-500">{pkg.description}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            <span className="text-sm text-slate-500">Total</span>
                            <span className="text-lg font-black text-slate-900">LKR {(pkg.price * guests).toLocaleString()}</span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/My-Verified-Journeys"
                        className="block w-full py-3 bg-[#ff6b35] text-white font-bold rounded-2xl text-sm hover:bg-[#e55a2b] transition-all mb-3"
                        onClick={onClose}
                    >
                        View My Journeys
                    </Link>
                    <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Continue Exploring</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#ff6b35] to-[#e55a2b] p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide">{pkg.name} Package</span>
                            <p className="text-3xl font-black mt-2">LKR {(pkg.price * guests).toLocaleString()}</p>
                            <p className="text-white/80 text-xs mt-0.5">{pkg.description}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all">
                            <ChevronDown className="w-4 h-4 rotate-180" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Includes */}
                    <div className="space-y-1.5">
                        {pkg.includes.map((item) => (
                            <div key={item} className="flex items-center space-x-2 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Date Picker */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 focus:border-[#ff6b35]"
                        />
                    </div>

                    {/* Guests */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Number of Guests</label>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-lg transition-all">−</button>
                            <span className="w-8 text-center font-bold text-slate-900">{guests}</span>
                            <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-lg transition-all">+</button>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Special Requests <span className="text-slate-300">(optional)</span></label>
                        <textarea
                            rows={2}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Any dietary needs, accessibility requirements..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 focus:border-[#ff6b35] resize-none"
                        />
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <div>
                            <p className="text-xs text-slate-400">Total · {guests} guest{guests > 1 ? "s" : ""}</p>
                            <p className="text-xl font-black text-slate-900">LKR {(pkg.price * guests).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Ceygo Protected</span>
                        </div>
                    </div>

                    <button
                        onClick={handleOrder}
                        disabled={!date}
                        className="w-full py-3.5 bg-[#ff6b35] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black rounded-2xl text-sm hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200 flex items-center justify-center space-x-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{date ? "Confirm Booking" : "Select a Date First"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GigPage() {
    const params = useParams();
    const gigId = parseInt(params.id as string);
    const gig = gigs.find((g) => g.id === gigId);

    const [selectedPkg, setSelectedPkg] = useState(0);
    const [activeImg, setActiveImg] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showOrder, setShowOrder] = useState(false);
    const [clearedLabels, setClearedLabels] = useState<string[]>([]);

    useEffect(() => {
        setClearedLabels(getClearedLabels());
        if (gig) setIsWishlisted(gig.isFavo);
    }, [gig]);

    const handleNavClick = (label: string) => {
        clearNavLabel(label);
        setClearedLabels(getClearedLabels());
    };

    if (!gig) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-400 text-lg font-semibold">Gig not found</p>
                    <Link href="/dashboard" className="text-[#ff6b35] text-sm mt-2 block hover:underline">← Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const pkg = gig.packages[selectedPkg];
    const avgRating = gig.rating;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {showOrder && <OrderModal pkg={pkg} gigTitle={gig.title} onClose={() => setShowOrder(false)} />}

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, active, count, href }) => {
                        const displayCount = clearedLabels.includes(label) ? 0 : count;
                        return (
                            <Link key={label} href={href} onClick={() => handleNavClick(label)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active ? "bg-orange-50 text-[#ff6b35] border border-orange-100 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`w-4 h-4 ${active ? "text-[#ff6b35]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                    <span>{label}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {displayCount > 0 && <span className="text-xs font-bold bg-[#ff6b35]/10 text-[#ff6b35] px-1.5 py-0.5 rounded-full">{displayCount}</span>}
                                    {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">AL</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Alex Müller</p>
                            <p className="text-xs text-slate-400 truncate">Traveler · Verified</p>
                        </div>
                        <Link href="/" onClick={() => { document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; }} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-auto">
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-14 flex-shrink-0 flex items-center px-6 bg-white border-b border-slate-200 space-x-4">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-800 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="font-medium">Back</span>
                    </Link>
                    <div className="w-px h-5 bg-slate-200" />
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                        <Link href="/dashboard" className="hover:text-[#ff6b35] transition-colors">Explore</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-500 font-medium">{gig.category}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-700 font-semibold truncate max-w-xs">{gig.vendor}</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                        </button>
                        <button onClick={() => setIsWishlisted(!isWishlisted)} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold transition-all hover:bg-slate-50">
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
                            <span className={isWishlisted ? "text-red-500" : "text-slate-600"}>Save</span>
                        </button>
                    </div>
                </header>

                {/* Page body */}
                <main className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-[1300px] mx-auto px-8 py-6">
                        {/* Title row */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xs font-bold text-[#ff6b35] bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">{gig.category}</span>
                                {gig.level === "Top Rated" && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center space-x-1"><BadgeCheck className="w-3 h-3" /><span>Top Rated</span></span>}
                                {gig.level === "Verified Pro" && <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full flex items-center space-x-1"><Shield className="w-3 h-3" /><span>Verified Pro</span></span>}
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 leading-snug max-w-3xl">{gig.title}</h1>
                            <div className="flex items-center space-x-4 mt-3 flex-wrap gap-y-2">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-900">{avgRating}</span>
                                    <span className="text-slate-400 text-sm">({gig.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-slate-500">
                                    <MapPin className="w-3.5 h-3.5 text-[#ff6b35]" />
                                    <span>{gig.location}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-slate-500">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>{gig.vendorOrders} orders completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Two-column layout */}
                        <div className="flex gap-8 items-start">
                            {/* Left: Gallery + Description + Reviews */}
                            <div className="flex-1 min-w-0 space-y-8">

                                {/* Gallery */}
                                <div>
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                                        <Image src={gig.gallery[activeImg]} alt={gig.title} fill className="object-cover" />
                                        {activeImg > 0 && (
                                            <button onClick={() => setActiveImg(activeImg - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm">
                                                <ChevronLeft className="w-4 h-4 text-slate-700" />
                                            </button>
                                        )}
                                        {activeImg < gig.gallery.length - 1 && (
                                            <button onClick={() => setActiveImg(activeImg + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm">
                                                <ChevronRight className="w-4 h-4 text-slate-700" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 mt-3">
                                        {gig.gallery.map((img, i) => (
                                            <button key={i} onClick={() => setActiveImg(i)} className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#ff6b35]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                                                <Image src={img} alt="" fill className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Seller Card */}
                                <div className="flex items-start space-x-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                        <Image src={gig.vendorImg} alt={gig.vendor} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-0.5">
                                            <p className="font-bold text-slate-900">{gig.vendor}</p>
                                            <span className="text-xs font-semibold text-[#ff6b35]">{gig.level}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2">
                                            <span className="flex items-center space-x-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-600">{avgRating}</span></span>
                                            <span>{gig.vendorOrders} orders</span>
                                            <span>Member since {gig.vendorSince}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed">{gig.vendorBio}</p>
                                    </div>
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-white hover:border-slate-300 transition-all flex-shrink-0">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Contact</span>
                                    </button>
                                </div>

                                {/* Description */}
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 mb-3">About This Experience</h2>
                                    <p className="text-slate-600 leading-relaxed text-sm mb-5">{gig.description}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {gig.highlights.map((h) => (
                                            <div key={h} className="flex items-center space-x-2.5 text-sm text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                <span>{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reviews */}
                                <div>
                                    <div className="flex items-center space-x-3 mb-5">
                                        <h2 className="text-lg font-black text-slate-900">Reviews</h2>
                                        <div className="flex items-center space-x-1 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-bold text-amber-700">{avgRating}</span>
                                            <span className="text-xs text-amber-600">({gig.reviews})</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {gig.reviewsList.map((r, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200 flex-shrink-0">
                                                        {r.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{r.name}</p>
                                                        <div className="flex items-center space-x-1">
                                                            {Array.from({ length: r.rating }).map((_, j) => (
                                                                <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            ))}
                                                            <span className="text-xs text-slate-400 ml-1">{r.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="flex items-center space-x-1.5 text-sm font-semibold text-[#ff6b35] hover:text-[#e55a2b] transition-colors mt-4">
                                        <span>View all {gig.reviews} reviews</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Report */}
                                <div className="pb-8">
                                    <button className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                                        <Flag className="w-3.5 h-3.5" />
                                        <span>Report this gig</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right: Sticky Order Sidebar */}
                            <div className="w-80 flex-shrink-0 sticky top-0">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                                    {/* Package Tabs */}
                                    <div className="flex border-b border-slate-100">
                                        {gig.packages.map((p, i) => (
                                            <button
                                                key={p.name}
                                                onClick={() => setSelectedPkg(i)}
                                                className={`flex-1 py-3 text-xs font-bold transition-all ${selectedPkg === i ? "text-[#ff6b35] border-b-2 border-[#ff6b35] bg-orange-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                                            >
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-5 space-y-4">
                                        {/* Price + desc */}
                                        <div>
                                            <div className="flex items-baseline justify-between">
                                                <p className="text-2xl font-black text-slate-900">LKR {pkg.price.toLocaleString()}</p>
                                                <span className="text-xs font-semibold text-slate-400">per person</span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">{pkg.description}</p>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                                            <div className="flex items-center space-x-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{pkg.delivery}</span>
                                            </div>
                                            {pkg.revisions > 0 && (
                                                <div className="flex items-center space-x-1.5">
                                                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{pkg.revisions} revision{pkg.revisions > 1 ? "s" : ""}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Includes */}
                                        <div className="space-y-1.5">
                                            {pkg.includes.map((item) => (
                                                <div key={item} className="flex items-center space-x-2 text-xs text-slate-700">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="h-px bg-slate-100" />

                                        {/* Order Button */}
                                        <button
                                            onClick={() => setShowOrder(true)}
                                            className="w-full py-3.5 bg-[#ff6b35] text-white font-black rounded-xl text-sm hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200 flex items-center justify-center space-x-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Order Now · LKR {pkg.price.toLocaleString()}</span>
                                        </button>

                                        {/* Instant */}
                                        <button
                                            onClick={() => setShowOrder(true)}
                                            className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:border-[#ff6b35]/40 hover:text-[#ff6b35] transition-all flex items-center justify-center space-x-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Contact Artisan</span>
                                        </button>

                                        {/* Trust */}
                                        <div className="flex items-start space-x-2 text-xs text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <p><span className="font-bold text-slate-600">Ceygo Protected</span> — Your payment is held securely until the experience is completed.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {[
                                        { label: "Rating", value: `${avgRating}★`, color: "text-amber-600" },
                                        { label: "Orders", value: `${gig.vendorOrders}+`, color: "text-[#ff6b35]" },
                                        { label: "Since", value: gig.vendorSince, color: "text-blue-600" },
                                    ].map(({ label, value, color }) => (
                                        <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
                                            <p className={`text-base font-black ${color}`}>{value}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Other gigs by same vendor */}
                                <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Zap className="w-4 h-4 text-[#ff6b35]" />
                                        <p className="text-xs font-bold text-slate-700">More from {gig.vendor.split(" ")[0]}</p>
                                    </div>
                                    <div className="space-y-2">
                                        {gigs.filter(g => g.id !== gig.id).slice(0, 2).map((other) => (
                                            <Link key={other.id} href={`/gig/${other.id}`} className="flex items-center space-x-2.5 group">
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image src={other.image} alt={other.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-700 line-clamp-2 group-hover:text-[#ff6b35] transition-colors leading-tight">{other.title}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">From LKR {other.price}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
