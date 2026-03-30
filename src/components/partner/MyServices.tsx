import { useState } from "react";
import { Plus, Star, Image as ImageIcon, Eye, MousePointerClick, CalendarCheck2, Trash2, Edit3, PauseCircle, PlayCircle } from "lucide-react";
import Image from "next/image";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";

// Extended mock data for services
const initialServices = [
    {
        id: 1,
        title: "I will take you on a Sunset TukTuk City Tour",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop",
        status: "Active",
        impressions: "1.2k",
        clicks: "342",
        orders: 2,
        cancellations: "0%",
        price: "LKR 2,800",
        rating: 4.8,
        reviews: 112,
    },
    {
        id: 2,
        title: "I will show you hidden Colombo Street Food",
        image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=600&auto=format&fit=crop",
        status: "Active",
        impressions: "850",
        clicks: "124",
        orders: 0,
        cancellations: "0%",
        price: "LKR 4,500",
        rating: 5.0,
        reviews: 24,
    },
    {
        id: 3,
        title: "I will drive you to Ella safely (One-way)",
        image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=600&auto=format&fit=crop",
        status: "Paused",
        impressions: "2.1k",
        clicks: "560",
        orders: 1,
        cancellations: "5%",
        price: "LKR 15,000",
        rating: 4.9,
        reviews: 8,
    },
];

type Toast = { id: number; message: string; type: "pause" | "resume" | "delete" };

export default function MyServices() {
    const [services, setServices] = useState(initialServices);
    const [filter, setFilter] = useState("All");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<typeof initialServices[0] | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: Toast["type"]) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const deleteService = (id: number) => {
        setServices(services.filter(s => s.id !== id));
        showToast("Service deleted.", "delete");
    };

    const toggleServiceStatus = (id: number) => {
        let nextStatus = "";
        setServices(services.map(s => {
            if (s.id === id) {
                nextStatus = s.status === "Active" ? "Paused" : "Active";
                return { ...s, status: nextStatus };
            }
            return s;
        }));
        setTimeout(() => {
            showToast(
                nextStatus === "Paused" ? "Service paused successfully." : "Service is now live!",
                nextStatus === "Paused" ? "pause" : "resume"
            );
        }, 0);
    };

    const handleAddService = (newService: any) => {
        setServices([newService, ...services]);
    };

    const handleSaveEdit = (updated: typeof initialServices[0]) => {
        setServices(services.map(s => s.id === updated.id ? updated : s));
        showToast("Service updated successfully!", "resume");
    };

    const filteredServices = services.filter((svc) => filter === "All" || svc.status === filter);

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
                                : toast.type === "delete"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        }`}
                    >
                        {toast.type === "pause" && <PauseCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                        {toast.type === "resume" && <PlayCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {toast.type === "delete" && (
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
            />

            <EditServiceModal
                service={editingService}
                isOpen={editingService !== null}
                onClose={() => setEditingService(null)}
                onSave={handleSaveEdit}
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
