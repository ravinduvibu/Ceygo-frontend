import { useState, useRef } from "react";
import { X, UploadCloud, MapPin, DollarSign, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Gig } from "@/types/gig";

interface CreateServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddService: (service: Gig) => void;
    onNotify: (message: string, type: any) => void;
    partnerId: string | null;
}

export default function CreateServiceModal({ isOpen, onClose, onAddService, onNotify, partnerId }: CreateServiceModalProps) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Tour");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('Gig Images')
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('Gig Images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            let imageUrl = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop";
            
            // 1. Upload image if selected
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (err: any) {
                    console.error("Storage upload error:", err);
                    onNotify("Failed to upload image. Please ensure the 'Gig Images' bucket exists and is public.", "error");
                    setIsSubmitting(false);
                    return;
                }
            }

            // 2. Call backend to save gig
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/add-gig`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    price,
                    description,
                    category,
                    location,
                    image: imageUrl,
                    partner_id: partnerId
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to create gig');
            }

            const result = await response.json();
            const realId = result.data?.[0]?.id;
            
            console.log("[Gig Creation] Received Real ID from Supabase:", realId);
            
            if (!realId) {
                console.warn("[Gig Creation] WARNING: No ID returned from backend. Deletion might fail after this.");
            }

            const newService = {
                id: realId || Date.now().toString(), // fallback if somehow empty
                title: title,
                image: imageUrl,
                status: "Active",
                impressions: "0",
                clicks: "0",
                orders: 0,
                cancellations: "0%",
                price: price.startsWith("LKR") ? price : `LKR ${price}`,
                rating: 0,
                reviews: 0,
                location: location,
                category: category,
                description: description,
                is_active: true
            };
            
            onAddService(newService);
            
            // Reset form
            setTitle("");
            setPrice("");
            setLocation("");
            setDescription("");
            setImageFile(null);
            setImagePreview(null);
            onClose();
        } catch (error: any) {
            console.error("Error creating gig:", error);
            onNotify(`Failed to create gig: ${error.message}`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
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
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                    
                    {/* Image Upload Area */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden relative ${imagePreview ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300'}`}
                    >
                        {imagePreview ? (
                            <>
                                <Image 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    fill 
                                    className="object-cover" 
                                />
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
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md shadow-emerald-200 transition-all flex items-center space-x-2 ${isSubmitting ? 'bg-emerald-400 opacity-70 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Publishing...</span>
                            </>
                        ) : (
                            <span>Publish Service</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
