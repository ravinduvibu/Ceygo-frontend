"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Star, Heart, MapPin, Clock, RefreshCw, CheckCircle2, Shield,
    ChevronLeft, ChevronRight, ChevronDown, BadgeCheck, Share2,
    Flag, MessageCircle, ArrowLeft, ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TravelerSidebar from "@/components/TravelerSidebar";

// ── Types ────────────────────────────────────────────────────
type GigPackage = {
    id: string;
    name: "Basic" | "Standard" | "Premium";
    price: number;
    description: string;
    delivery: string;
    revisions: number;
    includes: string[];
};

type ApiGig = {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string | null;
    location: string | null;
    image_url: string | null;
    rating: number | null;
    reviews_count: number | null;
    orders_count: number | null;
    created_at: string;
    profiles: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
        created_at: string;
    } | null;
};

// ── Order Modal ──────────────────────────────────────────────
function OrderModal({ pkg, gigTitle, gigId, onClose }: {
    pkg: GigPackage;
    gigTitle: string;
    gigId: string;
    onClose: () => void;
}) {
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!date) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gig_id: gigId, guests, booking_date: date, note }),
            });
            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error ?? "Failed to place order");
            }
            setOrdered(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    if (ordered) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Request Sent!</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-1">
                        Your booking request has been sent to the partner.
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
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 mb-4">
                        Awaiting partner approval — you&apos;ll see the status in My Journeys.
                    </p>
                    <Link href="/dashboard/My-Verified-Journeys" className="block w-full py-3 bg-[#ff6b35] text-white font-bold rounded-2xl text-sm hover:bg-[#e55a2b] transition-all mb-3" onClick={onClose}>
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
                    <div className="space-y-1.5">
                        {pkg.includes.map(item => (
                            <div key={item} className="flex items-center space-x-2 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Select Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 focus:border-[#ff6b35]" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Number of Guests</label>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-lg">−</button>
                            <span className="w-8 text-center font-bold text-slate-900">{guests}</span>
                            <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-lg">+</button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Special Requests <span className="text-slate-300">(optional)</span></label>
                        <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Any dietary needs, accessibility requirements..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 focus:border-[#ff6b35] resize-none" />
                    </div>
                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
                    )}
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
                    <button onClick={handleConfirm} disabled={!date || submitting}
                        className="w-full py-3.5 bg-[#ff6b35] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black rounded-2xl text-sm hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200 flex items-center justify-center space-x-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span>{submitting ? "Sending request…" : date ? "Request Booking" : "Select a Date First"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────
export default function GigPage() {
    const params = useParams();
    const gigId = params.id as string;

    const [gig, setGig] = useState<ApiGig | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [selectedPkg, setSelectedPkg] = useState(0);
    const [activeImg, setActiveImg] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showOrder, setShowOrder] = useState(false);

    useEffect(() => {
        fetch(`/api/gigs/${gigId}`)
            .then(r => {
                if (!r.ok) { setNotFound(true); setLoading(false); return null; }
                return r.json();
            })
            .then(data => {
                if (data) setGig(data);
                setLoading(false);
            })
            .catch(() => { setNotFound(true); setLoading(false); });
    }, [gigId]);

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
                <TravelerSidebar activePage="Dashboard" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#ff6b35] animate-spin" />
                </div>
            </div>
        );
    }

    if (notFound || !gig) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-400 text-lg font-semibold">Gig not found</p>
                    <Link href="/dashboard" className="text-[#ff6b35] text-sm mt-2 block hover:underline">← Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const vendorName = gig.profiles?.full_name ?? "Partner";
    const vendorImg = gig.profiles?.avatar_url ?? null;
    const vendorSince = gig.profiles?.created_at
        ? new Date(gig.profiles.created_at).getFullYear().toString()
        : "—";
    const rating = gig.rating ?? 0;
    const reviewsCount = gig.reviews_count ?? 0;
    const ordersCount = gig.orders_count ?? 0;

    const packages: GigPackage[] = [
        {
            id: "basic",
            name: "Basic",
            price: gig.price,
            description: gig.description ?? "Standard booking",
            delivery: "As scheduled",
            revisions: 0,
            includes: ["Service as described", "Direct contact with partner"],
        },
    ];

    const pkg = packages[selectedPkg];
    const gallery = gig.image_url ? [gig.image_url] : [];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {showOrder && pkg && <OrderModal pkg={pkg} gigTitle={gig.title} gigId={gig.id} onClose={() => setShowOrder(false)} />}

            <TravelerSidebar activePage="Dashboard" />

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
                        <span className="text-slate-500 font-medium">{gig.category ?? "Experience"}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-700 font-semibold truncate max-w-xs">{vendorName}</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                            <Share2 className="w-3.5 h-3.5" /><span>Share</span>
                        </button>
                        <button onClick={() => setIsWishlisted(!isWishlisted)} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold transition-all hover:bg-slate-50">
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
                            <span className={isWishlisted ? "text-red-500" : "text-slate-600"}>Save</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-[1300px] mx-auto px-8 py-6">
                        {/* Title row */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-2">
                                {gig.category && (
                                    <span className="text-xs font-bold text-[#ff6b35] bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">{gig.category}</span>
                                )}
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center space-x-1">
                                    <BadgeCheck className="w-3 h-3" /><span>Verified</span>
                                </span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 leading-snug max-w-3xl">{gig.title}</h1>
                            <div className="flex items-center space-x-4 mt-3 flex-wrap gap-y-2">
                                {rating > 0 && (
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="font-bold text-slate-900">{rating.toFixed(1)}</span>
                                        <span className="text-slate-400 text-sm">({reviewsCount} reviews)</span>
                                    </div>
                                )}
                                {gig.location && (
                                    <div className="flex items-center space-x-1 text-sm text-slate-500">
                                        <MapPin className="w-3.5 h-3.5 text-[#ff6b35]" /><span>{gig.location}</span>
                                    </div>
                                )}
                                {ordersCount > 0 && (
                                    <div className="flex items-center space-x-1 text-sm text-slate-500">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>{ordersCount} orders completed</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-8 items-start">
                            {/* Left column */}
                            <div className="flex-1 min-w-0 space-y-8">
                                {/* Gallery */}
                                {gallery.length > 0 && (
                                    <div>
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                                            <Image src={gallery[activeImg]} alt={gig.title} fill className="object-cover" />
                                            {activeImg > 0 && (
                                                <button onClick={() => setActiveImg(activeImg - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm">
                                                    <ChevronLeft className="w-4 h-4 text-slate-700" />
                                                </button>
                                            )}
                                            {activeImg < gallery.length - 1 && (
                                                <button onClick={() => setActiveImg(activeImg + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm">
                                                    <ChevronRight className="w-4 h-4 text-slate-700" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {gallery.length === 0 && (
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                        <span className="text-6xl">
                                            {gig.category === "Transport" ? "🚗" : gig.category === "Food" || gig.category === "Culinary & Food" ? "🍛" : "✨"}
                                        </span>
                                    </div>
                                )}

                                {/* Vendor card */}
                                <div className="flex items-start space-x-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-slate-200">
                                        {vendorImg && <Image src={vendorImg} alt={vendorName} fill className="object-cover" />}
                                        {!vendorImg && (
                                            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-500">
                                                {vendorName[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-0.5">
                                            <p className="font-bold text-slate-900">{vendorName}</p>
                                            <span className="text-xs font-semibold text-[#ff6b35]">Verified Partner</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2">
                                            {rating > 0 && (
                                                <span className="flex items-center space-x-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-600">{rating.toFixed(1)}</span></span>
                                            )}
                                            {ordersCount > 0 && <span>{ordersCount} orders</span>}
                                            <span>Member since {vendorSince}</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-white hover:border-slate-300 transition-all flex-shrink-0">
                                        <MessageCircle className="w-4 h-4" /><span>Contact</span>
                                    </button>
                                </div>

                                {/* Description */}
                                {gig.description && (
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900 mb-3">About This Experience</h2>
                                        <p className="text-slate-600 leading-relaxed text-sm">{gig.description}</p>
                                    </div>
                                )}

                                {/* Report */}
                                <div className="pb-8">
                                    <button className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                                        <Flag className="w-3.5 h-3.5" /><span>Report this gig</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right: Sticky order panel */}
                            <div className="w-80 flex-shrink-0 sticky top-0">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                                    {/* Package tabs */}
                                    <div className="flex border-b border-slate-100">
                                        {packages.map((p, i) => (
                                            <button key={p.name} onClick={() => setSelectedPkg(i)}
                                                className={`flex-1 py-3 text-xs font-bold transition-all ${selectedPkg === i ? "text-[#ff6b35] border-b-2 border-[#ff6b35] bg-orange-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>

                                    {pkg && (
                                        <div className="p-5 space-y-4">
                                            <div>
                                                <div className="flex items-baseline justify-between">
                                                    <p className="text-2xl font-black text-slate-900">LKR {pkg.price.toLocaleString()}</p>
                                                    <span className="text-xs font-semibold text-slate-400">per person</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1">{pkg.description}</p>
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                <div className="flex items-center space-x-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" /><span>{pkg.delivery}</span>
                                                </div>
                                                {pkg.revisions > 0 && (
                                                    <div className="flex items-center space-x-1.5">
                                                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" /><span>{pkg.revisions} revision{pkg.revisions > 1 ? "s" : ""}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                {pkg.includes.map(item => (
                                                    <div key={item} className="flex items-center space-x-2 text-xs text-slate-700">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /><span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="h-px bg-slate-100" />
                                            <button onClick={() => setShowOrder(true)}
                                                className="w-full py-3.5 bg-[#ff6b35] text-white font-black rounded-xl text-sm hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200 flex items-center justify-center space-x-2">
                                                <ShoppingCart className="w-4 h-4" />
                                                <span>Order Now · LKR {pkg.price.toLocaleString()}</span>
                                            </button>
                                            <button className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:border-[#ff6b35]/40 hover:text-[#ff6b35] transition-all flex items-center justify-center space-x-2">
                                                <MessageCircle className="w-4 h-4" /><span>Contact Artisan</span>
                                            </button>
                                            <div className="flex items-start space-x-2 text-xs text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <p><span className="font-bold text-slate-600">Ceygo Protected</span> — Your payment is held securely until the experience is completed.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Quick stats */}
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {[
                                        { label: "Rating", value: rating > 0 ? `${rating.toFixed(1)}★` : "New", color: "text-amber-600" },
                                        { label: "Orders", value: ordersCount > 0 ? `${ordersCount}+` : "—", color: "text-[#ff6b35]" },
                                        { label: "Since", value: vendorSince, color: "text-blue-600" },
                                    ].map(({ label, value, color }) => (
                                        <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
                                            <p className={`text-base font-black ${color}`}>{value}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
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
