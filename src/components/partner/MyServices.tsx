import { useState, useEffect } from "react";
import { Plus, Star, Image as ImageIcon, Eye, MousePointerClick, CalendarCheck2, Trash2, Edit3, PauseCircle, PlayCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import { Gig } from "@/types/gig";
import { supabase } from "@/lib/supabaseClient";

type Toast = { id: number; message: string; type: "pause" | "resume" | "delete" | "success" | "error" };

export default function MyServices() {
    const [services, setServices] = useState<Gig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [partnerId, setPartnerId] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Gig | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    // 1. Get the current user session
    useEffect(() => {
        const getPartner = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                console.log("[Auth] Active Partner Found:", user.id);
                setPartnerId(user.id);
            } else {
                console.warn("[Auth] No Active Partner Found. Gigs will be hidden.");
                setPartnerId(null);
                setIsLoading(false);
            }
        };
        getPartner();
    }, []);

    // 2. Fetch gigs once we have the partnerId
    useEffect(() => {
        if (!partnerId) {
            setServices([]); // Clear any previous services if user changed
            return;
        }

        const fetchGigs = async () => {
            try {
                console.log(`[Dashboard] Fetching gigs for: ${partnerId}`);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gigs?partner_id=${partnerId}`
                );
                if (!res.ok) throw new Error("Failed to fetch gigs");
                const json = await res.json();

                // Map DB rows → display format
                const mapped: Gig[] = (json.data || []).map((g: any) => ({
                    ...g,
                    id: g.id,
                    title: g.title,
                    image: g.image || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop",
                    status: g.is_active ? "Active" : "Paused",
                    impressions: "—",
                    clicks: "—",
                    orders: 0,
                    cancellations: "—",
                    price: g.price ? (g.price.startsWith("LKR") ? g.price : `LKR ${g.price}`) : "LKR 0",
                    rating: g.rating ?? 0,
                    reviews: g.reviews_count ?? 0,
                }));

                setServices(mapped);
            } catch (err) {
                console.error("Could not load gigs:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGigs();
    }, [partnerId]);

    const showToast = (message: string, type: Toast["type"]) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const deleteService = async (id: string | number) => {
        if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gigs/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error("Failed to delete service");
            
            setServices(prev => prev.filter(s => s.id !== id));
            showToast("Service deleted successfully.", "delete");
        } catch (err: any) {
            console.error("Delete error:", err);
            alert(`Failed to delete service: ${err.message}`);
        }
    };

    const toggleServiceStatus = async (id: string | number) => {
        const service = services.find(s => s.id === id);
        if (!service) return;

        const nextIsActive = service.status !== "Active";
        const nextStatus = nextIsActive ? "Active" : "Paused";

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gigs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: nextIsActive })
            });
            if (!res.ok) throw new Error("Failed to update status");

            setServices(prev => prev.map(s => {
                if (s.id === id) {
                    return { ...s, status: nextStatus, is_active: nextIsActive };
                }
                return s;
            }));

            showToast(
                nextStatus === "Paused" ? "Service paused successfully." : "Service is now live!",
                nextStatus === "Paused" ? "pause" : "resume"
            );
        } catch (err: any) {
            console.error("Status toggle error:", err);
            alert(`Failed to update status: ${err.message}`);
        }
    };

    const handleAddService = (newSvc: any) => {
        setServices([newSvc, ...services]);
        showToast("Gig published successfully!", "success");
    };

    const handleSaveEdit = (updated: Gig) => {
        setServices(services.map(s => s.id === updated.id ? updated : s));
        showToast("Service updated successfully!", "resume");
    };

    const filteredServices = services.filter((svc) => filter === "All" || svc.status === filter);

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

            {/* ── Toast Stack ── */}
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
                onAddService={handleAddService}
                onNotify={showToast}
                partnerId={partnerId}
            />

            <EditServiceModal
                service={editingService}
                isOpen={editingService !== null}
                onClose={() => setEditingService(null)}
                onSave={handleSaveEdit}
                onNotify={showToast}
            />


            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Services (Gigs)</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your offerings, track performance, and create new experiences.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all transform"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Service</span>
                </button>
            </div>

            {/* Top KPI Cards for Overall Services */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total Impressions", value: "4.1k", sub: "Last 30 days", icon: Eye, color: "blue" },
                    { label: "Total Clicks", value: "1.02k", sub: "Last 30 days", icon: MousePointerClick, color: "emerald" },
                    { label: "Active Orders", value: "3", sub: "Across all gigs", icon: CalendarCheck2, color: "amber" },
                    { label: "Completion Rate", value: "98%", sub: "Top rated partner", icon: Star, color: "orange" },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center flex-shrink-0`}>
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
            <div className="flex items-center space-x-1 border-b border-slate-200 mb-6">
                {["All", "Active", "Pending Approval", "Requires Modification", "Draft", "Paused"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-3 text-sm font-bold transition-all relative ${
                            filter === tab
                                ? "text-emerald-600"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        {tab}
                        <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                            {tab === "All" ? services.length : services.filter((s) => s.status === tab).length}
                        </span>
                        {filter === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />
                        )}
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
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No services found</h3>
                        <p className="text-sm text-slate-500">You don&apos;t have any services matching this filter.</p>
                        {filter !== "All" && (
                            <button onClick={() => setFilter("All")} className="mt-4 text-emerald-600 font-bold hover:underline">
                                View all services
                            </button>
                        )}
                    </div>
                ) : (
                    filteredServices.map((svc) => (
                        <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                            {/* Image Section */}
                            <div className="h-44 bg-slate-100 relative group cursor-pointer overflow-hidden">
                                <Image
                                    src={svc.image}
                                    alt={svc.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                {/* Status Badge */}
                                <div className="absolute top-3 left-3 flex items-center">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm flex items-center space-x-1.5 ${
                                        svc.status === 'Active' 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${svc.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                        <span>{svc.status}</span>
                                    </span>
                                </div>
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 backdrop-blur-[2px]">
                                    <button className="bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75" title="Preview Gig">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="bg-emerald-500/90 hover:bg-emerald-500 text-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100" title="Edit Gig">
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-1 relative">
                                <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors mb-4">
                                    {svc.title}
                                </h3>
                                
                                {/* Analytics Mini Grid */}
                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-y border-slate-100 py-3 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5">Impressions</span>
                                        <span className="text-slate-700 font-bold">{svc.impressions}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5">Clicks</span>
                                        <span className="text-slate-700 font-bold">{svc.clicks}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5">Orders</span>
                                        <span className="text-slate-700 font-bold">{svc.orders}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium mb-0.5">Cancellations</span>
                                        <span className="text-slate-700 font-bold">{svc.cancellations}</span>
                                    </div>
                                </div>
                                
                                {/* Bottom Row */}
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                                        <span className="text-sm font-black text-amber-500">{svc.rating}</span>
                                        <span className="text-xs text-slate-400 font-medium">({svc.reviews})</span>
                                    </div>
                                    <span className="text-base font-black text-slate-900">{svc.price}</span>
                                </div>
                            </div>
                            
                            {/* Footer Actions */}
                            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                                <div className="flex space-x-1">
                                    {/* Edit */}
                                    <button
                                        onClick={() => setEditingService(svc)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                        title="Edit service"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>

                                    {/* Pause / Resume */}
                                    <button
                                        onClick={() => toggleServiceStatus(svc.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                            svc.status === "Active"
                                                ? "text-slate-500 hover:text-amber-700 hover:bg-amber-50"
                                                : "text-amber-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        }`}
                                        title={svc.status === "Active" ? "Pause service" : "Resume service"}
                                    >
                                        {svc.status === "Active"
                                            ? <><PauseCircle className="w-3.5 h-3.5" /> Pause</>
                                            : <><PlayCircle className="w-3.5 h-3.5" /> Resume</>
                                        }
                                    </button>
                                </div>

                                {/* Delete */}
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
