"use client";

import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Compass,
    Star,
    BookOpen,
    Settings,
    ChevronRight,
    LogOut,
    UserCircle2,
    Bell,
    Globe,
    CreditCard,
    Shield,
    Camera,
    Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import TravelerSidebar from "@/components/TravelerSidebar";

// Note: navItems is now managed inside TravelerSidebar.

export default function TravelerSettings() {
    const [activeTab, setActiveTab] = useState("profile");
    
    // Form States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    
    // Alert States
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/signin');
                return;
            }

            setUserId(session.user.id);
            setEmail(session.user.email || "");
            
            const { data, error } = await supabase
                .from('users')
                .select('full_name, bio, avatar_base64')
                .eq('id', session.user.id)
                .single();
                
            if (data) {
                setFullName(data.full_name || "");
                setBio(data.bio || "");
                setAvatar(data.avatar_base64 || "");
            }
            setLoading(false);
        }
        
        loadProfile();
    }, [router]);

    // Handle Image Upload and Compression
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Ensure it's an image
        if (!file.type.startsWith('image/')) {
            setErrorMsg("Please upload a valid image file.");
            setTimeout(() => setErrorMsg(""), 4000);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 150;
                const MAX_HEIGHT = 150;
                let width = img.width;
                let height = img.height;

                // Circular/Square crop mathematically
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);
                // Compress to JPEG with 0.6 quality to ensure tiny size
                const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
                setAvatar(dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            // Get fresh session directly - don't rely on userId state timing
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setErrorMsg("You are not logged in. Please sign in again.");
                return;
            }

            const liveUserId = session.user.id;
            console.log("Saving for user:", liveUserId);
            console.log("Payload:", { full_name: fullName, bio, avatar_base64: avatar ? "HAS_AVATAR" : "NO_AVATAR" });

            // 1. Update Public Profile Table
            const { data: updateData, error: dbError, count } = await supabase
                .from('users')
                .update({ 
                    full_name: fullName, 
                    bio: bio,
                    avatar_base64: avatar
                })
                .eq('id', liveUserId)
                .select(); // .select() forces Supabase to return the updated row

            console.log("Update result:", { updateData, dbError, count });

            if (dbError) throw dbError;

            if (!updateData || updateData.length === 0) {
                throw new Error("Update matched 0 rows. Your user row may be missing from public.users.");
            }

            // 2. Optional: Update Auth Email if changed
            const { data: { user } } = await supabase.auth.getUser();
            let emailNotice = "";
            if (user && user.email !== email) {
                const { error: authError } = await supabase.auth.updateUser({ email });
                if (authError) throw authError;
                emailNotice = " Check your inbox to confirm your new email!";
            }

            setSuccessMsg(`Profile saved successfully!${emailNotice}`);
            setTimeout(() => setSuccessMsg(""), 5000);

        } catch (error: any) {
            console.error("SUPABASE SAVE ERROR:", error);
            alert("Save failed: " + (error.message || JSON.stringify(error)));
            setErrorMsg(error.message || "Failed to save profile.");
            setTimeout(() => setErrorMsg(""), 6000);
        } finally {
            setSaving(false);
        }
    };


    // Helper for Avatar Initials
    const initials = fullName ? fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "AA";

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 relative">
            
            {/* Error Toast */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${errorMsg ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"}`}>
                <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-red-900/95 backdrop-blur-md text-white shadow-2xl border border-red-800">
                    <span className="text-sm font-semibold tracking-wide">{errorMsg}</span>
                </div>
            </div>

            {/* Success Toast */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${successMsg ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"}`}>
                <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-emerald-900/95 backdrop-blur-md text-white shadow-2xl border border-emerald-800">
                    <span className="text-sm font-semibold tracking-wide">{successMsg}</span>
                </div>
            </div>

            {/* ── Reusable Dynamic Sidebar ── */}
            <TravelerSidebar activePage="Settings" />

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Personal Settings</h1>
                        <p className="text-xs text-slate-400">Manage your profile, preferences, and verified status.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1000px] mx-auto flex space-x-8">
                        {/* Tabs Navigation */}
                        <div className="w-64 flex-shrink-0 space-y-1">
                            {[
                                { id: "profile", label: "Profile", icon: UserCircle2 },
                                { id: "preferences", label: "Preferences", icon: Globe },
                                { id: "notifications", label: "Notifications", icon: Bell },
                                { id: "security", label: "Password & Security", icon: Shield },
                                { id: "payment", label: "Payment Methods", icon: CreditCard },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        activeTab === id
                                            ? "bg-white text-[#ff6b35] shadow-sm border border-slate-200"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Settings Content Pane */}
                        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[600px]">
                            {loading ? (
                                <div className="h-full flex items-center justify-center opacity-50 font-bold animate-pulse">Loading Your Identity...</div>
                            ) : activeTab === "profile" && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                ref={fileInputRef} 
                                                onChange={handleImageUpload} 
                                            />
                                            <div className={`w-24 h-24 rounded-full ${!avatar ? "bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9]" : ""} flex items-center justify-center text-3xl font-bold text-white shadow-md relative overflow-hidden ring-4 ring-white`}>
                                                {avatar ? <Image src={avatar} alt="Avatar" fill className="object-cover" /> : initials}
                                            </div>
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:text-[#ff6b35] transition-colors shadow-sm"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">Your Avatar</h2>
                                            <p className="text-sm text-slate-400 mt-1">PNG, JPG. Compress dynamically on browser. Verified users get a badge.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                            <input 
                                                value={fullName} 
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                                            <input 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email" 
                                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" 
                                            />
                                        </div>
                                        <div className="space-y-1.5 col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Travel Bio</label>
                                            <textarea 
                                                rows={3} 
                                                value={bio} 
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell artisants about your journey..."
                                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <button 
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-6 py-2.5 rounded-xl bg-[#ff6b35] disabled:opacity-50 text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!loading && activeTab !== "profile" && (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50 select-none animate-in fade-in duration-300">
                                    <LayoutDashboard className="w-12 h-12 text-slate-300" />
                                    <p className="text-slate-500 font-medium">This section is currently under construction.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
