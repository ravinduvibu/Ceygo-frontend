import { useState, useEffect } from "react";
import { X, UploadCloud, MapPin, DollarSign, CheckCircle2 } from "lucide-react";

interface Service {
    id: number;
    title: string;
    price: string;
    status: string;
    [key: string]: any;
}

interface EditServiceModalProps {
    service: Service | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updated: Service) => void;
}

export default function EditServiceModal({ service, isOpen, onClose, onSave }: EditServiceModalProps) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Tour");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    // Prefill with current service values whenever modal opens
    useEffect(() => {
        if (service && isOpen) {
            setTitle(service.title);
            // Strip "LKR " prefix if present
            setPrice(service.price.replace(/^LKR\s?/, "").replace(",", ""));
            setSaved(false);
            setIsSubmitting(false);
        }
    }, [service, isOpen]);

    if (!isOpen || !service) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const formattedPrice = price
                ? `LKR ${Number(price.replace(/,/g, "")).toLocaleString()}`
                : service.price;

            onSave({
                ...service,
                title,
                price: formattedPrice,
            });

            setIsSubmitting(false);
            setSaved(true);

            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 1000);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Edit Service</h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Update your gig details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Image placeholder */}
                    <div className="w-full h-28 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-emerald-300 hover:text-emerald-500 transition-colors cursor-pointer group">
                        <UploadCloud className="w-7 h-7 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold">Replace Cover Image</span>
                        <span className="text-[10px] uppercase tracking-wider mt-0.5 opacity-70">1200 × 800px recommended</span>
                    </div>

                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
                                Gig Title
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="I will take you on a..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 font-medium placeholder:font-normal placeholder:text-slate-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
                                    Category
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 font-medium appearance-none bg-white"
                                    >
                                        <option value="Tour">City Tour</option>
                                        <option value="Food">Food Experience</option>
                                        <option value="Transport">Transport</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
                                    Price (LKR)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 5,000"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || saved}
                            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                                saved
                                    ? "bg-emerald-500 shadow-emerald-200"
                                    : isSubmitting
                                    ? "bg-emerald-400 opacity-70 cursor-not-allowed shadow-emerald-200"
                                    : "bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 shadow-emerald-200"
                            }`}
                        >
                            {saved ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Saved!
                                </>
                            ) : isSubmitting ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
