import { useState, useRef } from "react";
import { X, UploadCloud, MapPin, DollarSign, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface CreateServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddService: () => void;
    onNotify: (message: string, type: "error" | "pause" | "resume" | "delete" | "success") => void;
    partnerId: string | null;
}

export default function CreateServiceModal({ isOpen, onClose, onAddService, onNotify }: CreateServiceModalProps) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Tour");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setTitle("");
        setPrice("");
        setLocation("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
        setSubmitted(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !price.trim()) {
            onNotify("Title and price are required.", "error");
            return;
        }

        setIsSubmitting(true);

        // Upload image if provided (base64 data URL — keep as-is for now)
        const image_url = imagePreview ?? null;

        const res = await fetch("/api/partner/gigs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, price, category, location, description, image_url }),
        });

        setIsSubmitting(false);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            onNotify(err.error ?? "Failed to create gig.", "error");
            return;
        }

        setSubmitted(true);
        onAddService();
        void imageFile; // suppress unused warning — reserved for future storage upload
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Gig Submitted!</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Your gig is pending admin approval. It will go live once reviewed.
                    </p>
                    <button
                        onClick={handleClose}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Create New Service</h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">List a new experience or gig on Ceygo</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">

                    {/* Image Upload Area */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden relative ${imagePreview ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300"}`}
                    >
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-bold bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-sm">Change Image</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-8 h-8 mb-2 text-slate-400 group-hover:scale-110 group-hover:text-emerald-500 transition-all" />
                                <span className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600">Upload Cover Image</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 opacity-70">JPEG, PNG or WebP</span>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Gig Title</label>
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
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Category</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 font-medium appearance-none bg-white"
                                    >
                                        <option value="Tour">City Tour</option>
                                        <option value="Food">Food Experience</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Stay">Accommodation</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Galle Fort"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Price (LKR)</label>
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

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                            <textarea
                                required
                                placeholder="Describe what the customer will experience..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 font-medium placeholder:font-normal placeholder:text-slate-400 min-h-[100px] resize-none"
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end space-x-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md shadow-emerald-200 transition-all flex items-center space-x-2 ${isSubmitting ? "bg-emerald-400 opacity-70 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5"}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <span>Submit for Approval</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
