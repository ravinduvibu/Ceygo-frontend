import { X, CalendarCheck2, Clock, MapPin, MessageSquare, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface Buyer {
    name: string;
    avatar: string;
    location: string;
}

interface Order {
    id: string;
    gigTitle: string;
    gigImage: string;
    buyer: Buyer;
    date: string;
    deadline: string;
    price: string;
    status: string;
    color: string;
}

interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus?: (status: string) => void;
    onNavigateToInbox?: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose, onUpdateStatus, onNavigateToInbox }: OrderDetailsModalProps) {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-black text-slate-900">Order Details</h2>
                            <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-${order.color}-200 bg-${order.color}-50 text-${order.color}-700`}>
                                <span className={`w-1.5 h-1.5 rounded-full bg-${order.color}-500 ${["In Progress", "Priority"].includes(order.status) ? "animate-pulse" : ""}`} />
                                <span>{order.status}</span>
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{order.id} • Ordered {order.date}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto overflow-x-hidden flex-1 p-6 space-y-8">
                    {/* Buyer Summary */}
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-lg font-bold text-slate-700 shadow-sm border border-slate-100">
                                {order.buyer.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5">Purchased by</p>
                                <p className="text-base font-black text-slate-900">{order.buyer.name}</p>
                                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 mt-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{order.buyer.location}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                onNavigateToInbox?.();
                                onClose();
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Message Buyer</span>
                        </button>
                    </div>

                    {/* Gig Details */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gig Information</h3>
                        <div className="flex gap-4">
                            <div className="w-32 h-20 relative rounded-xl overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">
                                <Image src={order.gigImage} alt={order.gigTitle} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-lg font-bold text-slate-800 leading-snug">{order.gigTitle}</h4>
                                <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">Standard Package</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div className="flex items-center space-x-2 mb-2 text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-wider uppercase">Delivery Deadline</span>
                            </div>
                            <p className="text-xl font-black text-slate-900">{order.deadline}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div className="flex items-center space-x-2 mb-2 text-slate-500">
                                <CreditCard className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-wider uppercase">Base Price</span>
                            </div>
                            <p className="text-xl font-black text-slate-900">{order.price}</p>
                        </div>
                    </div>

                    {/* Requirements / Extras */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Buyer Requirements</h3>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed">
                            "Hi, we're very excited for the trip! We are a couple, please make sure there's enough room for a small backpack. We'll be waiting at the main entrance."
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Order Summary</h3>
                        </div>
                        <div className="p-4 bg-white space-y-3">
                            <div className="flex justify-between text-sm font-semibold text-slate-600">
                                <span>Base Gig ({order.gigTitle})</span>
                                <span>{order.price}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-slate-600">
                                <span>Service Fee</span>
                                <span>LKR 0</span>
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-emerald-800">Total Earnings</span>
                            <span className="text-xl font-black text-emerald-600">{order.price}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white border-t border-slate-100 flex justify-end space-x-3 flex-shrink-0">
                    {order.status === "Pending" && (
                        <button 
                            onClick={() => {
                                onUpdateStatus?.("Cancelled");
                                onClose();
                            }}
                            className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold shadow-sm transition-all"
                        >
                            Decline
                        </button>
                    )}
                    
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold shadow-sm transition-all"
                    >
                        Close
                    </button>

                    {order.status === "Pending" && onUpdateStatus && (
                        <button 
                            onClick={() => {
                                onUpdateStatus("In Progress");
                                onClose();
                            }}
                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center space-x-2 shadow-sm shadow-emerald-200 transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept Order</span>
                        </button>
                    )}

                    {(order.status === "In Progress" || order.status === "Priority") && onUpdateStatus && (
                        <button 
                            onClick={() => {
                                onUpdateStatus("Completed");
                                onClose();
                            }}
                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center space-x-2 shadow-sm shadow-emerald-200 transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark as Completed</span>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
