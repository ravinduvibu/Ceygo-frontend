"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search, Filter, MessageSquare, CheckCircle2, Clock,
    MoreVertical, ChevronDown, Check, Loader2, XCircle,
} from "lucide-react";
import Image from "next/image";
import OrderDetailsModal, { type ModalOrder } from "./OrderDetailsModal";

// ── Types ─────────────────────────────────────────────────────
type RawApiOrder = {
    id: string;
    status: string;
    amount: number;
    notes: string | null;
    created_at: string;
    gigs: { id: string; title: string; image_url: string | null } | null;
    profiles: { id: string; full_name: string | null } | null;
};

type DisplayOrder = ModalOrder & {
    gigImageUrl: string | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending:   { label: "Pending",     color: "amber"   },
    active:    { label: "In Progress", color: "blue"    },
    completed: { label: "Completed",   color: "emerald" },
    cancelled: { label: "Cancelled",   color: "red"     },
    declined:  { label: "Declined",    color: "red"     },
};

function parseNotes(raw: string | null) {
    try { return JSON.parse(raw ?? "{}"); } catch { return {}; }
}

function mapOrder(o: RawApiOrder): DisplayOrder {
    const { label, color } = STATUS_CONFIG[o.status] ?? { label: o.status, color: "slate" };
    const notes = parseNotes(o.notes);
    const buyerName = o.profiles?.full_name ?? "Traveler";
    const bookingDate = notes.booking_date
        ? new Date(notes.booking_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "TBD";
    return {
        rawId:       o.id,
        id:          `ORD-${o.id.slice(0, 6).toUpperCase()}`,
        gigTitle:    o.gigs?.title ?? "—",
        gigImage:    o.gigs?.image_url ?? null,
        gigImageUrl: o.gigs?.image_url ?? null,
        buyerName,
        buyerAvatar: buyerName.slice(0, 2).toUpperCase(),
        date:        new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        bookingDate,
        guests:      notes.guests ?? 1,
        price:       `LKR ${o.amount.toLocaleString("en-LK")}`,
        notes:       notes.note ?? "",
        status:      label,
        color,
    };
}

interface ActiveOrdersProps {
    onNavigateToInbox?: () => void;
}

export default function ActiveOrders({ onNavigateToInbox }: ActiveOrdersProps) {
    const [orders, setOrders] = useState<DisplayOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [gigFilter, setGigFilter] = useState("All Gigs");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<DisplayOrder | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/partner/orders");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data.map(mapOrder) : []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleAction = async (rawId: string, action: "accept" | "decline") => {
        await fetch(`/api/partner/orders/${rawId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        await fetchOrders();
    };

    const uniqueGigs = ["All Gigs", ...Array.from(new Set(orders.map(o => o.gigTitle)))];

    const filtered = orders.filter(o => {
        let matchesFilter = true;
        if (filter === "Active")    matchesFilter = ["In Progress", "Pending"].includes(o.status);
        else if (filter === "Completed") matchesFilter = o.status === "Completed";
        else if (filter === "Cancelled") matchesFilter = ["Cancelled", "Declined"].includes(o.status);
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.gigTitle.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q);
        const matchesGig = gigFilter === "All Gigs" || o.gigTitle === gigFilter;
        return matchesFilter && matchesSearch && matchesGig;
    });

    const countFor = (tab: string) => {
        if (tab === "All") return orders.length;
        if (tab === "Active") return orders.filter(o => ["In Progress", "Pending"].includes(o.status)).length;
        if (tab === "Completed") return orders.filter(o => o.status === "Completed").length;
        if (tab === "Cancelled") return orders.filter(o => ["Cancelled", "Declined"].includes(o.status)).length;
        return 0;
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OrderDetailsModal
                isOpen={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onAction={handleAction}
                onNavigateToInbox={onNavigateToInbox}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Orders</h2>
                    <p className="text-sm text-slate-500 mt-1">Review booking requests and manage your experiences.</p>
                </div>
                <div className="flex items-center space-x-3 relative">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search orders..."
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-colors ${isFilterOpen ? "ring-2 ring-emerald-500/20 border-emerald-500" : ""}`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>{gigFilter === "All Gigs" ? "Filter" : "Filtered"}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filter by Gig</p>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {uniqueGigs.map(gig => (
                                        <button
                                            key={gig}
                                            onClick={() => { setGigFilter(gig); setIsFilterOpen(false); }}
                                            className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-slate-50 flex items-center justify-between transition-colors"
                                        >
                                            <span className={`truncate ${gigFilter === gig ? "text-emerald-600" : "text-slate-700"}`}>{gig}</span>
                                            {gigFilter === gig && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs + Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center space-x-6 px-6 border-b border-slate-200 bg-slate-50/50">
                    {["Active", "Completed", "Cancelled", "All"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`py-4 text-sm font-bold transition-all relative ${filter === tab ? "text-emerald-600" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            {tab}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === tab ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                                {countFor(tab)}
                            </span>
                            {filter === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto w-full">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 space-x-3 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-medium">Loading orders…</span>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-4 px-6">Buyer</th>
                                    <th className="py-4 px-6">Gig</th>
                                    <th className="py-4 px-6">Booking Date</th>
                                    <th className="py-4 px-6">Total</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Search className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">No orders found</p>
                                            <p className="text-xs text-slate-500 mt-1">Orders from travelers will appear here.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(order => (
                                        <tr key={order.rawId} className="hover:bg-slate-50/80 transition-colors">
                                            {/* Buyer */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0">
                                                        {order.buyerAvatar}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{order.buyerName}</p>
                                                        <button
                                                            onClick={() => onNavigateToInbox?.()}
                                                            className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 mt-0.5 transition-colors"
                                                        >
                                                            <MessageSquare className="w-3 h-3" />
                                                            <span>Message</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Gig */}
                                            <td className="py-4 px-6 max-w-[220px]">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-14 h-10 relative rounded-md overflow-hidden flex-shrink-0 border border-slate-200 bg-slate-100">
                                                        {order.gigImageUrl ? (
                                                            <Image src={order.gigImageUrl} alt={order.gigTitle} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-lg">✨</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800 line-clamp-2">{order.gigTitle}</p>
                                                        <p className="text-xs font-medium text-slate-400 mt-0.5">{order.id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6">
                                                <p className="text-sm font-bold text-slate-900">{order.bookingDate}</p>
                                                <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Ordered {order.date}</span>
                                                </p>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-6">
                                                <p className="text-sm font-black text-slate-900">{order.price}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{order.guests} guest{order.guests !== 1 ? "s" : ""}</p>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-md border border-${order.color}-200 bg-${order.color}-50 text-${order.color}-700`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full bg-${order.color}-500 ${order.status === "Pending" ? "animate-pulse" : ""}`} />
                                                    <span>{order.status}</span>
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {order.status === "Pending" ? (
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 transition-all flex items-center space-x-1.5"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>Review</span>
                                                        </button>
                                                    ) : (order.status === "Declined" || order.status === "Cancelled") ? (
                                                        <span className="flex items-center space-x-1 text-xs font-semibold text-slate-400">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            <span>{order.status}</span>
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm transition-all"
                                                        >
                                                            View
                                                        </button>
                                                    )}
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
