"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
    Star, Heart, MapPin, Clock, RefreshCw, CheckCircle2, Shield,
    ChevronLeft, ChevronRight, ChevronDown, BadgeCheck, Share2,
    Flag, MessageCircle, ArrowLeft, ShoppingCart, Zap,
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

type GigReview = {
    id: string;
    reviewer: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
};

type Gig = {
    id: string;
    title: string;
    vendor: string;
    vendor_img: string;
    image: string;
    gallery: string[];
    rating: number;
    reviews_count: number;
    price: string;
    level: string;
    category: string;
    location: string;
    vendor_since: string;
    vendor_orders: number;
    vendor_bio: string;
    description: string;
    highlights: string[];
    packages: GigPackage[];
    reviews: GigReview[];
};

// ── Order Modal ──────────────────────────────────────────────
function OrderModal({ pkg, gigTitle, onClose }: {
    pkg: GigPackage;
    gigTitle: string;
    onClose: () => void;
}) {
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [note, setNote] = useState("");
    const [ordered, setOrdered] = useState(false);

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
                    <button onClick={() => date && setOrdered(true)} disabled={!date}
                        className="w-full py-3.5 bg-[#ff6b35] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black rounded-2xl text-sm hover:bg-[#e55a2b] transition-all shadow-sm shadow-orange-200 flex items-center justify-center space-x-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span>{date ? "Confirm Booking" : "Select a Date First"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Mock Gig Data ───────────────────────────────────────────
const MOCK_GIGS: Record<string, Gig> = {
    "gig-001": {
        id: "gig-001", title: "Sunset TukTuk City Tour through the streets of Colombo",
        vendor: "Nuwan Perera", vendor_img: "/images/traveler1.png",
        image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800",
        gallery: [
            "https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=800",
            "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800",
        ],
        rating: 4.9, reviews_count: 128, price: "2,800", level: "Top Rated",
        category: "Transport", location: "Colombo", vendor_since: "2022", vendor_orders: 312,
        vendor_bio: "Born and raised in Colombo, Nuwan has been sharing his city's hidden gems with travelers for over 5 years. Certified local guide with fluent English.",
        description: "Hop aboard a classic TukTuk and explore the vibrant streets of Colombo as the sun sets. We'll cruise through the Pettah market bazaars, past colonial-era buildings, and end at the famous Galle Face Green for a stunning ocean sunset.",
        highlights: ["Pettah Market visit", "Colonial architecture tour", "Galle Face sunset", "Local street food stops", "Air-conditioned TukTuk", "Flexible pickup"],
        packages: [
            { id: "p1", name: "Basic", price: 2800, description: "1-hour city highlights tour", delivery: "1 hour", revisions: 0, includes: ["TukTuk ride", "Route map", "Water bottle"] },
            { id: "p2", name: "Standard", price: 4500, description: "2-hour extended tour with food stops", delivery: "2 hours", revisions: 1, includes: ["TukTuk ride", "2 street food stops", "Local guide narration", "Photo spots"] },
            { id: "p3", name: "Premium", price: 7500, description: "3-hour private sunset tour + dinner", delivery: "3 hours", revisions: 2, includes: ["Private TukTuk", "Sunset dinner", "Custom route", "Airport drop", "Professional photos"] },
        ],
        reviews: [
            { id: "r1", reviewer: "Sarah J.", avatar: "SJ", rating: 5, comment: "Absolutely incredible experience! Nuwan was knowledgeable, friendly, and took us to spots we'd never have found on our own.", date: "March 2026" },
            { id: "r2", reviewer: "Marco R.", avatar: "MR", rating: 5, comment: "Best evening in Colombo by far. The street food stops were delicious and the sunset at Galle Face was magical.", date: "Feb 2026" },
        ],
    },
    "gig-002": {
        id: "gig-002", title: "Hidden Colombo Street Food Walk — Local Secrets Only",
        vendor: "Saman Silva", vendor_img: "/images/traveler2.png",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
        gallery: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
        ],
        rating: 5.0, reviews_count: 47, price: "4,500", level: "Verified Pro",
        category: "Culinary & Food", location: "Pettah, Colombo", vendor_since: "2021", vendor_orders: 198,
        vendor_bio: "Saman is a self-proclaimed 'food archaeologist' who has mapped every hidden eatery in Colombo's Pettah district. Featured in Lonely Planet Sri Lanka.",
        description: "Join Saman on a 2.5-hour walk through the oldest food markets in Colombo. You'll taste hoppers, kottu roti, pol sambol, and fresh king coconut from vendors that have been here for generations.",
        highlights: ["8+ tastings included", "Pettah market secrets", "Traditional recipe stories", "Vegetarian-friendly options", "Small group max 6", "Rain or shine"],
        packages: [
            { id: "p1", name: "Basic", price: 4500, description: "2.5-hour guided food walk", delivery: "2.5 hours", revisions: 0, includes: ["8 tastings", "Water", "Walking guide"] },
            { id: "p2", name: "Standard", price: 6500, description: "Full experience with cooking demo", delivery: "4 hours", revisions: 0, includes: ["All Basic +", "Cooking demonstration", "Recipe booklet", "Market shopping"] },
            { id: "p3", name: "Premium", price: 10000, description: "Private foodie day tour", delivery: "6 hours", revisions: 0, includes: ["Private group", "Lunch included", "Spice market visit", "Personalized route"] },
        ],
        reviews: [
            { id: "r1", reviewer: "Elena V.", avatar: "EV", rating: 5, comment: "Saman is a treasure. We tasted things we'd never have found in a restaurant. Absolutely worth every rupee.", date: "April 2026" },
        ],
    },
    "gig-003": {
        id: "gig-003", title: "Private Sigiriya Rock Fortress & Ancient Village Half-Day",
        vendor: "Priya Fernando", vendor_img: "/images/traveler3.png",
        image: "https://images.unsplash.com/photo-1590845947376-2638caa89309?q=80&w=800",
        gallery: ["https://images.unsplash.com/photo-1590845947376-2638caa89309?q=80&w=800"],
        rating: 4.8, reviews_count: 214, price: "12,000", level: "Top Rated",
        category: "Heritage Tours", location: "Sigiriya, Central Province", vendor_since: "2020", vendor_orders: 540,
        vendor_bio: "Priya is a certified UNESCO heritage guide with a Masters in Sri Lankan archaeology. She brings the ancient kingdoms of Sri Lanka to life with vivid storytelling.",
        description: "Ascend the iconic Sigiriya Rock — the 8th wonder of the ancient world — with a licensed heritage guide. Explore the royal gardens, the famous frescoes, and the ancient water systems that still function today.",
        highlights: ["UNESCO World Heritage Site", "Licensed heritage guide", "Dambulla Cave Temple visit", "Village lunch included", "Air-conditioned transfer", "Hotel pickup"],
        packages: [
            { id: "p1", name: "Basic", price: 12000, description: "Sigiriya Rock guided climb", delivery: "4 hours", revisions: 0, includes: ["Entry tickets", "Guide", "Water"] },
            { id: "p2", name: "Standard", price: 18000, description: "Sigiriya + Dambulla full day", delivery: "8 hours", revisions: 0, includes: ["All Basic +", "Dambulla visit", "Village lunch", "Hotel transfer"] },
            { id: "p3", name: "Premium", price: 28000, description: "Private cultural immersion day", delivery: "10 hours", revisions: 0, includes: ["Private vehicle", "Sunrise climb", "Traditional dinner", "Photography session"] },
        ],
        reviews: [
            { id: "r1", reviewer: "David M.", avatar: "DM", rating: 5, comment: "Priya's knowledge of the ancient kingdoms is unmatched. The most educational and entertaining day of our entire trip.", date: "March 2026" },
            { id: "r2", reviewer: "Yuki T.", avatar: "YT", rating: 4, comment: "Great guide, the climb is challenging but totally worth it for the views. Bring good shoes!", date: "Jan 2026" },
        ],
    },
};
// Fallback for IDs not in the map
const FALLBACK_GIG: Gig = MOCK_GIGS["gig-001"];

// ── Main Page ────────────────────────────────────────────────
export default function GigPage() {
    const params = useParams();
    const gigId = params.id as string;

    const gig: Gig | null = MOCK_GIGS[gigId] || null;
    const loading = false;
    const notFound = !gig;

    const [selectedPkg, setSelectedPkg] = useState(0);
    const [activeImg, setActiveImg] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showOrder, setShowOrder] = useState(false);


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

    const pkg = gig.packages[selectedPkg];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {showOrder && pkg && <OrderModal pkg={pkg} gigTitle={gig.title} onClose={() => setShowOrder(false)} />}

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
                        <span className="text-slate-500 font-medium">{gig.category}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-700 font-semibold truncate max-w-xs">{gig.vendor}</span>
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
                                <span className="text-xs font-bold text-[#ff6b35] bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">{gig.category}</span>
                                {gig.level === "Top Rated" && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center space-x-1"><BadgeCheck className="w-3 h-3" /><span>Top Rated</span></span>}
                                {gig.level === "Verified Pro" && <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full flex items-center space-x-1"><Shield className="w-3 h-3" /><span>Verified Pro</span></span>}
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 leading-snug max-w-3xl">{gig.title}</h1>
                            <div className="flex items-center space-x-4 mt-3 flex-wrap gap-y-2">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-900">{gig.rating}</span>
                                    <span className="text-slate-400 text-sm">({gig.reviews_count} reviews)</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-slate-500">
                                    <MapPin className="w-3.5 h-3.5 text-[#ff6b35]" /><span>{gig.location}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-slate-500">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>{gig.vendor_orders} orders completed</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-8 items-start">
                            {/* Left column */}
                            <div className="flex-1 min-w-0 space-y-8">
                                {/* Gallery */}
                                <div>
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                                        {gig.gallery?.[activeImg] && (
                                            <Image src={gig.gallery[activeImg]} alt={gig.title} fill className="object-cover" />
                                        )}
                                        {activeImg > 0 && (
                                            <button onClick={() => setActiveImg(activeImg - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm">
                                                <ChevronLeft className="w-4 h-4 text-slate-700" />
                                            </button>
                                        )}
                                        {activeImg < (gig.gallery?.length ?? 0) - 1 && (
                                            <button onClick={() => setActiveImg(activeImg + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm">
                                                <ChevronRight className="w-4 h-4 text-slate-700" />
                                            </button>
                                        )}
                                    </div>
                                    {gig.gallery && gig.gallery.length > 1 && (
                                        <div className="flex space-x-2 mt-3">
                                            {gig.gallery.map((img, i) => (
                                                <button key={i} onClick={() => setActiveImg(i)} className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#ff6b35]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                                                    <Image src={img} alt="" fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Vendor card */}
                                <div className="flex items-start space-x-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                        {gig.vendor_img && <Image src={gig.vendor_img} alt={gig.vendor} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-0.5">
                                            <p className="font-bold text-slate-900">{gig.vendor}</p>
                                            <span className="text-xs font-semibold text-[#ff6b35]">{gig.level}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2">
                                            <span className="flex items-center space-x-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-600">{gig.rating}</span></span>
                                            <span>{gig.vendor_orders} orders</span>
                                            <span>Member since {gig.vendor_since}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed">{gig.vendor_bio}</p>
                                    </div>
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-white hover:border-slate-300 transition-all flex-shrink-0">
                                        <MessageCircle className="w-4 h-4" /><span>Contact</span>
                                    </button>
                                </div>

                                {/* Description */}
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 mb-3">About This Experience</h2>
                                    <p className="text-slate-600 leading-relaxed text-sm mb-5">{gig.description}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {gig.highlights?.map(h => (
                                            <div key={h} className="flex items-center space-x-2.5 text-sm text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>{h}</span>
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
                                            <span className="text-sm font-bold text-amber-700">{gig.rating}</span>
                                            <span className="text-xs text-amber-600">({gig.reviews_count})</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {gig.reviews?.map(r => (
                                            <div key={r.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200 flex-shrink-0">
                                                        {r.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{r.reviewer}</p>
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
                                </div>

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
                                        {gig.packages.map((p, i) => (
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
                                                {pkg.includes?.map(item => (
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
                                            <button onClick={() => setShowOrder(true)}
                                                className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:border-[#ff6b35]/40 hover:text-[#ff6b35] transition-all flex items-center justify-center space-x-2">
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
                                        { label: "Rating", value: `${gig.rating}★`, color: "text-amber-600" },
                                        { label: "Orders", value: `${gig.vendor_orders}+`, color: "text-[#ff6b35]" },
                                        { label: "Since", value: gig.vendor_since, color: "text-blue-600" },
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
