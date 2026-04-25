"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Star, Image as ImageIcon, Eye, MousePointerClick, CalendarCheck2, Trash2, Edit3, PauseCircle, PlayCircle, Loader2, Clock } from "lucide-react";
import Image from "next/image";
import CreateServiceModal from "./CreateServiceModal";
import { useAuth } from "@/contexts/AuthContext";

interface ApiGig {
    id: string;
    title: string;
    price: number;
    category: string | null;
    location: string | null;
    image_url: string | null;
    rating: number | null;
    reviews_count: number | null;
    orders_count: number | null;
    is_active: boolean;
    impressions: number | null;
    clicks: number | null;
}

interface ServiceCard {
    id: string;
    title: string;
    image: string;
    status: string;
    impressions: string;
    clicks: string;
    orders: number;
    price: string;
    rating: number;
    reviews: number;
    location: string;
    category: string;
    is_active: boolean;
}

type Toast = { id: number; message: string; type: "pause" | "resume" | "delete" | "success" | "error" };

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop";

function mapApiGig(g: ApiGig): ServiceCard {
    return {
        id: g.id,
        title: g.title,
        image: g.image_url ?? PLACEHOLDER_IMG,
        status: g.is_active ? "Active" : "Pending Approval",
        impressions: (g.impressions ?? 0).toLocaleString(),
        clicks: (g.clicks ?? 0).toLocaleString(),
        orders: g.orders_count ?? 0,
        price: `LKR ${g.price.toLocaleString("en-LK")}`,
        rating: g.rating ?? 0,
        reviews: g.reviews_count ?? 0,
        location: g.location ?? "",
        category: g.category ?? "",
        is_active: g.is_active,
    };
}

export default function MyServices() {
    const { profile } = useAuth();
    const [services, setServices] = useState<ServiceCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: Toast["type"]) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const fetchGigs = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/partner/gigs");
            const data = await res.json();
            setServices(Array.isArray(data) ? data.map(mapApiGig) : []);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchGigs(); }, [fetchGigs]);

    const deleteService = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) return;
        const res = await fetch(`/api/partner/gigs/${id}`, { method: "DELETE" });
        if (res.ok) {
            setServices(prev => prev.filter(s => s.id !== id));
            showToast("Service deleted successfully.", "delete");
        } else {
            showToast("Failed to delete service.", "error");
        }
    };

    const togglePause = async (id: string) => {
        const svc = services.find(s => s.id === id);
        if (!svc || !svc.is_active) return;
        const res = await fetch(`/api/partner/gigs/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: false }),
        });
        if (res.ok) {
            setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: false, status: "Pending Approval" } : s));
            showToast("Service paused. Re-submit for admin approval to go live again.", "pause");
        } else {
            showToast("Failed to update service.", "error");
        }
    };

    const filteredServices = services.filter(svc =>
        filter === "All" || svc.status === filter
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-6 w-full">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
                        <div className="h-44 bg-slate-100" />
                        <div className="p-5 space-y-3">
                            <div className="h-4 bg-slate-100 rounded w-3/4" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {/* Toast Stack */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-right-4 fade-in duration-300 pointer-events-auto ${
                            toast.type === "pause"
                                ? "bg-amber-50 border-amber-200 text-amber-800"
                                : toast.type === "delete" || toast.type === "error"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        }`}
                    >
                        {(toast.type === "resume" || toast.type === "success") && <PlayCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {toast.type === "pause" && <PauseCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                        {(toast.type === "delete" || toast.type === "error") && (
                            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        )}
                        {toast.message}
                    </div>
                ))}
            </div>

            <CreateServiceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onAddService={() => { fetchGigs(); showToast("Gig submitted for approval!", "success"); }}
                onNotify={showToast}
                partnerId={profile?.id ?? null}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Services (Gigs)</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your offerings, track performance, and create new experiences.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Service</span>
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total Services",    value: services.length,                                          sub: "All gigs",           icon: ImageIcon,     color: "blue" },
                    { label: "Active Gigs",        value: services.filter(s => s.status === "Active").length,      sub: "Live on platform",   icon: Eye,           color: "emerald" },
                    { label: "Pending Approval",   value: services.filter(s => s.status === "Pending Approval").length, sub: "Awaiting review", icon: Clock,        color: "amber" },
                    { label: "Total Orders",       value: services.reduce((a, s) => a + s.orders, 0),             sub: "Across all gigs",    icon: CalendarCheck2, color: "orange" },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center shrink-0`}>
                            <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                            <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">{kpi.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-1 border-b border-slate-200">
                {["All", "Active", "Pending Approval"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-3 text-sm font-bold transition-all relative ${
                            filter === tab ? "text-emerald-600" : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        {tab}
                        <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                            {tab === "All" ? services.length : services.filter(s => s.status === tab).length}
                        </span>
                        {filter === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
                    </button>
                ))}
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-3 gap-6">
                {filteredServices.length === 0 ? (
                    <div className="col-span-3 py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {services.length === 0 ? "No services yet" : "No services matching this filter"}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {services.length === 0 ? "Create your first gig to start earning." : "Try a different filter."}
                        </p>
                        {services.length === 0 && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-4 flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create First Gig</span>
                            </button>
                        )}
                        {filter !== "All" && services.length > 0 && (
                            <button onClick={() => setFilter("All")} className="mt-4 text-emerald-600 font-bold hover:underline">
                                View all services
                            </button>
                        )}
                    </div>
                ) : (
                    filteredServices.map((svc) => (
                        <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                            {/* Image */}
                            <div className="h-44 bg-slate-100 relative overflow-hidden">
                                <Image
                                    src={svc.image}
                                    alt={svc.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm flex items-center space-x-1.5 ${
                                        svc.status === "Active"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${svc.status === "Active" ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                                        <span>{svc.status}</span>
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 backdrop-blur-[2px]">
                                    <button className="bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75" title="Preview Gig">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="bg-emerald-500/90 hover:bg-emerald-500 text-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100" title="Edit Gig">
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 hover:text-emerald-600 transition-colors mb-4">
                                    {svc.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-y border-slate-100 py-3 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5 flex items-center gap-1"><Eye className="w-3 h-3" /> Impressions</span>
                                        <span className="text-slate-700 font-bold">{svc.impressions}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5 flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> Clicks</span>
                                        <span className="text-slate-700 font-bold">{svc.clicks}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5 flex items-center gap-1"><CalendarCheck2 className="w-3 h-3" /> Orders</span>
                                        <span className="text-slate-700 font-bold">{svc.orders}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5">Location</span>
                                        <span className="text-slate-700 font-bold truncate">{svc.location || "—"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                                        <span className="text-sm font-black text-amber-500">{svc.rating.toFixed(1)}</span>
                                        <span className="text-xs text-slate-400 font-medium">({svc.reviews})</span>
                                    </div>
                                    <span className="text-base font-black text-slate-900">{svc.price}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                                <div>
                                    {svc.status === "Active" && (
                                        <button
                                            onClick={() => togglePause(svc.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                        >
                                            <PauseCircle className="w-3.5 h-3.5" /> Pause
                                        </button>
                                    )}
                                    {svc.status === "Pending Approval" && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-600">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Awaiting review
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteService(svc.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete service"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
