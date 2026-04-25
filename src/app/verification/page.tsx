"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ShieldCheck, CheckCircle2, Clock, Search, MapPin,
    Tag, DollarSign, XCircle, MessageSquare, User,
    Calendar, AlertTriangle,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────
interface ApiGig {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string | null;
    location: string | null;
    image_url: string | null;
    is_active: boolean;
    approval_status: string | null;
    created_at: string;
    profiles: {
        id: string;
        full_name: string | null;
        email: string | null;
        created_at: string | null;
    } | null;
}

interface GigCard {
    id: string;
    title: string;
    shortTitle: string;
    description: string;
    price: string;
    priceRaw: number;
    category: string;
    location: string;
    image_url: string | null;
    partnerName: string;
    partnerEmail: string;
    partnerId: string;
    submittedAt: string;
    submittedRelative: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
    tour: "🗺️", transport: "🚗", food: "🍛", culinary: "🍛",
    stay: "🏠", guide: "🧭", experience: "✨", artisan: "🎨",
    adventure: "🏄", wellness: "🌿", nature: "🌿", wildlife: "🦜",
};

function gigEmoji(category: string): string {
    const cat = category.toLowerCase();
    for (const [key, val] of Object.entries(CATEGORY_EMOJI)) {
        if (cat.includes(key)) return val;
    }
    return "✨";
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function mapGig(g: ApiGig): GigCard {
    const submitted = new Date(g.created_at);
    return {
        id: g.id,
        title: g.title,
        shortTitle: g.title.length > 32 ? g.title.slice(0, 32) + "…" : g.title,
        description: g.description ?? "No description provided.",
        price: `LKR ${g.price.toLocaleString("en-LK")}`,
        priceRaw: g.price,
        category: g.category ?? "General",
        location: g.location ?? "Sri Lanka",
        image_url: g.image_url,
        partnerName: g.profiles?.full_name ?? "Unknown Partner",
        partnerEmail: g.profiles?.email ?? "—",
        partnerId: g.profiles?.id ?? g.id,
        submittedAt: submitted.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        submittedRelative: timeAgo(g.created_at),
    };
}

// ── Page ──────────────────────────────────────────────────────
export default function GigVerificationPage() {
    const [gigs, setGigs] = useState<GigCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const fetchGigs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/gigs");
            const data = await res.json();
            const mapped: GigCard[] = Array.isArray(data) ? data.map(mapGig) : [];
            setGigs(mapped);
            if (mapped.length > 0 && selectedId === null) {
                setSelectedId(mapped[0].id);
            }
        } finally {
            setLoading(false);
        }
    }, [selectedId]);

    useEffect(() => { fetchGigs(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = (id: string) => {
        setSelectedId(id);
        setNotes("");
        setDecision(null);
    };

    const handleDecision = async (action: "approve" | "reject") => {
        if (!gig) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/gigs/${gig.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, admin_notes: notes }),
            });
            if (res.ok) {
                setDecision(action === "approve" ? "approved" : "rejected");
                // remove from queue
                setGigs(prev => {
                    const next = prev.filter(g => g.id !== gig.id);
                    setSelectedId(next.length > 0 ? next[0].id : null);
                    return next;
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const filteredGigs = search.trim()
        ? gigs.filter(g =>
            g.title.toLowerCase().includes(search.toLowerCase()) ||
            g.partnerName.toLowerCase().includes(search.toLowerCase()) ||
            g.category.toLowerCase().includes(search.toLowerCase())
        )
        : gigs;

    const gig = gigs.find(g => g.id === selectedId) ?? null;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            <AdminSidebar activePage="Gig Verification" />

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Gig Approval Queue</h1>
                        <p className="text-xs text-slate-400">Review and approve partner gig listings</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 w-52">
                            <Search className="w-4 h-4 text-slate-400 shrink-0" />
                            <input
                                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                                placeholder="Search gigs or partners…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-5 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto flex gap-5 h-full">

                        {/* ── Left: Queue ── */}
                        <div className="w-64 shrink-0 flex flex-col gap-4">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pending Queue</h2>
                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                        {filteredGigs.length}
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-50 max-h-[calc(100vh-200px)] overflow-y-auto">
                                    {loading && (
                                        <div className="px-4 py-8 text-center text-xs text-slate-400">Loading…</div>
                                    )}
                                    {!loading && filteredGigs.length === 0 && (
                                        <div className="px-4 py-8 flex flex-col items-center text-center gap-2">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                                            <p className="text-xs font-semibold text-slate-500">All caught up!</p>
                                            <p className="text-[10px] text-slate-400">No pending gigs to review.</p>
                                        </div>
                                    )}
                                    {filteredGigs.map(g => (
                                        <button
                                            key={g.id}
                                            onClick={() => handleSelect(g.id)}
                                            className={`w-full text-left px-3 py-3 transition-all hover:bg-slate-50 ${
                                                selectedId === g.id
                                                    ? "bg-orange-50 border-l-2 border-[#ff6b35]"
                                                    : "border-l-2 border-transparent"
                                            }`}
                                        >
                                            <p className={`text-xs font-semibold truncate ${selectedId === g.id ? "text-[#ff6b35]" : "text-slate-700"}`}>
                                                {gigEmoji(g.category)} {g.shortTitle}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[10px] text-slate-400 truncate">{g.partnerName}</span>
                                                <span className="text-[10px] text-slate-300 shrink-0 ml-1">{g.submittedRelative}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Center: Gig Detail ── */}
                        <div className="flex-1 flex flex-col gap-4 min-w-0">

                            {decision && (
                                <div className={`rounded-2xl border p-5 flex items-center space-x-4 ${
                                    decision === "approved"
                                        ? "bg-emerald-50 border-emerald-200"
                                        : "bg-red-50 border-red-200"
                                }`}>
                                    {decision === "approved"
                                        ? <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
                                        : <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                                    }
                                    <div>
                                        <p className={`text-sm font-bold ${decision === "approved" ? "text-emerald-700" : "text-red-700"}`}>
                                            {decision === "approved" ? "Gig approved and live!" : "Gig rejected."}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${decision === "approved" ? "text-emerald-600" : "text-red-500"}`}>
                                            {decision === "approved"
                                                ? "The gig is now visible to travelers."
                                                : "The partner has been notified."}
                                        </p>
                                    </div>
                                    <button onClick={() => setDecision(null)} className="ml-auto text-xs text-slate-400 hover:text-slate-600 underline">
                                        Dismiss
                                    </button>
                                </div>
                            )}

                            {!gig && !loading && (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed py-20">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-200 mb-3" />
                                    <p className="text-sm font-semibold text-slate-500">
                                        {gigs.length === 0 ? "No pending gigs — queue is empty." : "Select a gig from the queue."}
                                    </p>
                                </div>
                            )}

                            {gig && (
                                <>
                                    {/* Gig overview */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        {/* Cover image */}
                                        <div className="h-48 bg-slate-100 relative">
                                            {gig.image_url ? (
                                                <Image src={gig.image_url} alt={gig.title} fill className="object-cover" sizes="100%" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="text-center">
                                                        <span className="text-5xl">{gigEmoji(gig.category)}</span>
                                                        <p className="text-xs text-slate-400 mt-2">No cover image</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" /> Pending Review
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h2 className="text-xl font-black text-slate-900 mb-1">{gig.title}</h2>
                                            <p className="text-sm text-slate-500 leading-relaxed mb-5">{gig.description}</p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { icon: DollarSign, label: "Price",    value: gig.price,       color: "emerald" },
                                                    { icon: Tag,        label: "Category", value: gig.category,    color: "blue" },
                                                    { icon: MapPin,     label: "Location", value: gig.location,    color: "orange" },
                                                    { icon: Calendar,   label: "Submitted",value: gig.submittedAt, color: "purple" },
                                                ].map(({ icon: Icon, label, value, color }) => (
                                                    <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                        <div className="flex items-center space-x-1.5 mb-1">
                                                            <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
                                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{label}</span>
                                                        </div>
                                                        <p className="text-xs font-semibold text-slate-800">{value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Partner info */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Partner Info</h3>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200 shrink-0">
                                                {gig.partnerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{gig.partnerName}</p>
                                                <p className="text-xs text-slate-400">{gig.partnerEmail}</p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                                                <User className="w-3 h-3" />
                                                ID: {gig.partnerId.slice(0, 8)}…
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Right: Decision Panel ── */}
                        <div className="w-64 shrink-0 flex flex-col gap-4">
                            {gig && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
                                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Review Decision</h2>

                                    {/* Checklist */}
                                    <div className="space-y-2">
                                        {[
                                            { label: "Title is clear and descriptive", ok: gig.title.length > 10 },
                                            { label: "Price is reasonable",           ok: gig.priceRaw > 0 },
                                            { label: "Category is set",               ok: gig.category !== "General" },
                                            { label: "Location is provided",          ok: !!gig.location },
                                            { label: "Description is provided",       ok: gig.description !== "No description provided." },
                                            { label: "Cover image uploaded",          ok: !!gig.image_url },
                                        ].map(({ label, ok }) => (
                                            <div key={label} className="flex items-center justify-between text-xs">
                                                <span className={ok ? "text-slate-700" : "text-slate-400"}>{label}</span>
                                                {ok
                                                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                    : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                }
                                            </div>
                                        ))}
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Admin Notes (optional)</label>
                                        <textarea
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            rows={4}
                                            className="mt-1 w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 resize-none placeholder-slate-400 text-slate-700 transition-all"
                                            placeholder="Reason for rejection or notes…"
                                        />
                                    </div>

                                    {/* Action buttons */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleDecision("approve")}
                                            disabled={submitting}
                                            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-sm shadow-emerald-200 flex items-center justify-center space-x-2"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>Approve &amp; Publish</span>
                                        </button>
                                        <button
                                            onClick={() => handleDecision("reject")}
                                            disabled={submitting}
                                            className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-red-50 disabled:opacity-60 text-slate-500 hover:text-red-600 text-xs font-semibold border border-slate-200 hover:border-red-200 transition-all flex items-center justify-center space-x-1.5"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>Reject Gig</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!gig && !loading && (
                                <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-6 flex flex-col items-center text-center gap-2">
                                    <MessageSquare className="w-8 h-8 text-slate-200" />
                                    <p className="text-xs text-slate-400">Select a gig to review</p>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
