"use client";

import { useState, useEffect } from "react";
import {
    CheckCircle2, MapPin, Clock, Star, Bookmark,
    Loader2, XCircle, AlertCircle,
} from "lucide-react";
import Image from "next/image";
import TravelerSidebar from "@/components/TravelerSidebar";

type TravelerOrder = {
    id: string;
    status: "pending" | "active" | "completed" | "cancelled" | "declined";
    amount: number;
    notes: string | null;
    created_at: string;
    gigs: {
        id: string;
        title: string;
        image_url: string | null;
        category: string | null;
        location: string | null;
    } | null;
    profiles: { full_name: string | null } | null;
};

type ParsedNotes = { booking_date?: string; guests?: number; note?: string };

function parseNotes(raw: string | null): ParsedNotes {
    try { return JSON.parse(raw ?? "{}"); } catch { return {}; }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending:   { label: "Awaiting Partner",  color: "amber",   icon: <Clock className="w-3.5 h-3.5" /> },
    active:    { label: "Confirmed",          color: "blue",    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    completed: { label: "Completed",          color: "emerald", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    declined:  { label: "Declined",           color: "red",     icon: <XCircle className="w-3.5 h-3.5" /> },
    cancelled: { label: "Cancelled",          color: "red",     icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function MyVerifiedJourneysPage() {
    const [orders, setOrders] = useState<TravelerOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/traveler/orders")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
                else setError(data.error ?? "Failed to load orders");
                setLoading(false);
            })
            .catch(() => { setError("Network error"); setLoading(false); });
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            <TravelerSidebar activePage="My Verified Journeys" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex-shrink-0 flex items-center px-8 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
                            <Bookmark className="w-6 h-6 text-[#ff6b35]" />
                            <span>My Verified Journeys</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5 font-medium">Track your bookings and experience status.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-[1000px] mx-auto">

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                                <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
                                <p className="text-sm text-slate-400">Loading your journeys…</p>
                            </div>
                        )}

                        {error && (
                            <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                                <p className="text-sm font-semibold text-slate-600">{error}</p>
                            </div>
                        )}

                        {!loading && !error && orders.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
                                <div className="text-5xl">🗺️</div>
                                <p className="text-lg font-bold text-slate-700">No journeys yet</p>
                                <p className="text-sm text-slate-400">Browse experiences and make your first booking!</p>
                            </div>
                        )}

                        {!loading && !error && orders.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {orders.map(order => {
                                    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                                    const notes = parseNotes(order.notes);
                                    const gigTitle = order.gigs?.title ?? "Experience";
                                    const partnerName = order.profiles?.full_name ?? "Partner";
                                    const category = order.gigs?.category ?? "Experience";
                                    const location = order.gigs?.location ?? null;
                                    const imageUrl = order.gigs?.image_url ?? null;
                                    const gigEmoji = category === "Transport" ? "🚗" : category?.includes("Food") || category?.includes("Culinary") ? "🍛" : "✨";

                                    return (
                                        <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                            {/* Image */}
                                            <div className="relative h-36 bg-slate-100">
                                                {imageUrl ? (
                                                    <Image src={imageUrl} alt={gigTitle} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-5xl">{gigEmoji}</div>
                                                )}
                                                <div className={`absolute top-3 right-3 flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-full border bg-${cfg.color}-50 text-${cfg.color}-700 border-${cfg.color}-200 shadow-sm`}>
                                                    {cfg.icon}
                                                    <span>{cfg.label}</span>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="mb-3">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{category} · {partnerName}</p>
                                                    <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-2">{gigTitle}</h3>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Booking Date</p>
                                                        <p className="font-semibold text-slate-800">
                                                            {notes.booking_date
                                                                ? new Date(notes.booking_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                                : "—"
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Guests</p>
                                                        <p className="font-semibold text-slate-800">{notes.guests ?? 1}</p>
                                                    </div>
                                                    {location && (
                                                        <div className="col-span-2 flex items-center space-x-1 text-slate-500">
                                                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="text-xs font-medium truncate">{location}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-base font-black text-slate-900">LKR {order.amount.toLocaleString("en-LK")}</span>

                                                    {order.status === "completed" ? (
                                                        <button className="flex items-center space-x-1.5 px-4 py-2 bg-[#ff6b35] text-white rounded-xl text-xs font-bold hover:bg-[#e55a2b] transition-all">
                                                            <Star className="w-3.5 h-3.5 fill-white" />
                                                            <span>Leave Review</span>
                                                        </button>
                                                    ) : order.status === "declined" || order.status === "cancelled" ? (
                                                        <span className="text-xs text-slate-400 font-medium">Request closed</span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium">
                                                            Ordered {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
