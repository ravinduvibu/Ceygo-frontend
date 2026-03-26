import { useState } from "react";
import { X, UploadCloud, MapPin, DollarSign, Image as ImageIcon } from "lucide-react";

interface CreateServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddService: (service: any) => void;
}

export default function CreateServiceModal({ isOpen, onClose, onAddService }: CreateServiceModalProps) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Tour");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            const newService = {
                id: Date.now(),
                title: title,
                image: category === "Food" 
                        ? "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=600&auto=format&fit=crop" 
                        : "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop",
                status: "Pending Approval",
                impressions: "0",
                clicks: "0",
                orders: 0,
                cancellations: "0%",
                price: price || "LKR 0",
                rating: 0,
                reviews: 0,
                // for the dashboard page text emojis
                emoji: category === "Food" ? "🍛" : "🛺"
            };
            
            onAddService(newService);
            setIsSubmitting(false);
            setTitle("");
            setPrice("");
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Create New Service</h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">List a new experience or gig on Ceygo</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Image Upload Area Placeholder */}
                    <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-emerald-300 hover:text-emerald-500 transition-colors cursor-pointer group">
                        <UploadCloud className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold">Upload Cover Image</span>
                        <span className="text-[10px] uppercase tracking-wider mt-1 opacity-70">1200 x 800px recommended</span>
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
                        </div>
                    </div>
                    
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
                            disabled={isSubmitting}
                            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md shadow-emerald-200 transition-all ${isSubmitting ? 'bg-emerald-400 opacity-70 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5'}`}
                        >
                            {isSubmitting ? "Publishing..." : "Publish Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
