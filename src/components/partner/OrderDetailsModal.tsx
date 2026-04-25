import { X, Clock, MapPin, MessageSquare, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ModalOrder {
    rawId: string;
    id: string;
    gigTitle: string;
    gigImage: string | null;
    buyerName: string;
    buyerAvatar: string;
    date: string;
    bookingDate: string;
    guests: number;
    price: string;
    notes: string;
    status: string;
    color: string;
}

interface OrderDetailsModalProps {
    order: ModalOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onAction: (rawId: string, action: "accept" | "decline") => Promise<void>;
    onNavigateToInbox?: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose, onAction, onNavigateToInbox }: OrderDetailsModalProps) {
    const [loading, setLoading] = useState<"accept" | "decline" | null>(null);

    if (!isOpen || !order) return null;

    const handleAction = async (action: "accept" | "decline") => {
        setLoading(action);
        try {
            await onAction(order.rawId, action);
            onClose();
        } finally {
            setLoading(null);
        }
    };

    const isPending = order.status === "Pending";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-black text-slate-900">Order Details</h2>
                            <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-${order.color}-200 bg-${order.color}-50 text-${order.color}-700`}>
                                <span className={`w-1.5 h-1.5 rounded-full bg-${order.color}-500 ${order.status === "Pending" ? "animate-pulse" : ""}`} />
                                <span>{order.status}</span>
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{order.id} • Ordered {order.date}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Buyer */}
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-lg font-bold text-slate-700 shadow-sm border border-slate-100">
                                {order.buyerAvatar}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5">Requested by</p>
                                <p className="text-base font-black text-slate-900">{order.buyerName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { onNavigateToInbox?.(); onClose(); }}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Message</span>
                        </button>
                    </div>

                    {/* Gig */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gig</h3>
                        <div className="flex gap-4">
                            <div className="w-32 h-20 relative rounded-xl overflow-hidden shadow-sm border border-slate-200 flex-shrink-0 bg-slate-100">
                                {order.gigImage ? (
                                    <Image src={order.gigImage} alt={order.gigTitle} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">✨</div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-lg font-bold text-slate-800 leading-snug">{order.gigTitle}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Booking details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div className="flex items-center space-x-2 mb-2 text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-wider uppercase">Booking Date</span>
                            </div>
                            <p className="text-xl font-black text-slate-900">{order.bookingDate}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div className="flex items-center space-x-2 mb-2 text-slate-500">
                                <CreditCard className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-wider uppercase">Total · {order.guests} guest{order.guests !== 1 ? "s" : ""}</span>
                            </div>
                            <p className="text-xl font-black text-slate-900">{order.price}</p>
                        </div>
                    </div>

                    {/* Special requests */}
                    {order.notes && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Special Requests</h3>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed">
                                {order.notes}
                            </div>
                        </div>
                    )}

                    {/* Location hint */}
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Traveler will contact you closer to the date for exact pickup details.</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-slate-100 flex justify-end space-x-3 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold shadow-sm transition-all">
                        Close
                    </button>
                    {isPending && (
                        <>
                            <button
                                onClick={() => handleAction("decline")}
                                disabled={loading !== null}
                                className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold shadow-sm transition-all disabled:opacity-50 flex items-center space-x-2"
                            >
                                {loading === "decline" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                <span>Decline</span>
                            </button>
                            <button
                                onClick={() => handleAction("accept")}
                                disabled={loading !== null}
                                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center space-x-2 shadow-sm shadow-emerald-200 transition-all disabled:opacity-50"
                            >
                                {loading === "accept" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                <span>Accept Order</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
