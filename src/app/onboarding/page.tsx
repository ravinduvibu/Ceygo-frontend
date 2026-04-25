"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    ChevronLeft,
    MapPin,
    Briefcase,
    Mail,
    Phone,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
    Store,
    Activity,
    ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
    const [step, setStep] = useState<Step>(1);
    const [formData, setFormData] = useState({
        businessName: "",
        category: "",
        email: "",
        phone: "",
        location: "",
        description: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const categories = [
        { id: "transport", label: "Transport", desc: "Tuk-tuks, Vans, Private Drivers", icon: MapPin },
        { id: "guide", label: "Local Guide", desc: "History, Trekking, City Tours", icon: Briefcase },
        { id: "experience", label: "Experiences", desc: "Cooking, Workshops, Safaris", icon: Sparkles },
        { id: "artisan", label: "Artisan", desc: "Masks, Jewelry, Handcrafts", icon: Store },
    ];

    const validateStep = (currentStep: Step): boolean => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (formData.businessName.length < 3) newErrors.businessName = "Min 3 characters required";
            if (!formData.category) newErrors.category = "Please select a category";
        } else if (currentStep === 2) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address";

            const lkPhoneRegex = /^(?:0|94|\+94)?(?:7|1|2|3|4|5|6|8|9)\d{8}$/;
            if (!lkPhoneRegex.test(formData.phone)) newErrors.phone = "Enter a valid Sri Lankan mobile number";
        } else if (currentStep === 3) {
            if (formData.description.length < 20) newErrors.description = "Please provide more details (min 20 chars)";
            if (formData.location.length < 3) newErrors.location = "City/Region is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) setStep((s) => (s + 1) as Step);
    };

    const prevStep = () => {
        setStep((s) => (s - 1) as Step);
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        setIsSubmitting(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/signin");
            return;
        }

        const { error } = await supabase
            .from("partner_profiles")
            .upsert({
                partner_id: user.id,
                business_name: formData.businessName,
                category: formData.category,
                phone: formData.phone,
                location: formData.location,
                description: formData.description,
                approval_status: "pending",
            }, { onConflict: "partner_id" });

        if (error) {
            setErrors({ submit: error.message });
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        setStep(4);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-8">
                <div className="relative h-10 w-28">
                    <Image src="/images/logo_transparent.png" alt="Ceygo Logo" fill className="object-contain" priority />
                </div>
                <div className="hidden md:flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Secure Onboarding</span>
                </div>
                <Link href="/signin" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                    Cancel
                </Link>
            </header>

            <main className="flex-1 pt-32 pb-20 px-6 flex items-start justify-center">
                <div className="w-full max-w-2xl">

                    {/* Progress Indicator */}
                    {step < 4 && (
                        <div className="mb-12 flex items-center justify-center space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all border-2 shadow-sm ${
                                        step === i ? "bg-[#ff6b35] border-[#ff6b35] text-white scale-110" :
                                        step > i ? "bg-emerald-500 border-emerald-500 text-white" :
                                        "bg-white border-slate-200 text-slate-400"
                                    }`}>
                                        {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                                    </div>
                                    {i < 3 && (
                                        <div className={`w-12 h-0.5 mx-2 rounded-full transition-colors ${step > i ? "bg-emerald-500" : "bg-slate-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff6b35]/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                        {/* Step 1 — Identity */}
                        {step === 1 && (
                            <div className="space-y-8 relative">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 mb-2">Build your identity.</h1>
                                    <p className="text-slate-500 font-medium">Let&apos;s start with your business name and category.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Registered Name</label>
                                        <input type="text" value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className={`w-full px-5 py-4 bg-slate-50 border rounded-3xl text-sm font-medium transition-all outline-none ${errors.businessName ? "border-red-300 bg-red-50/10" : "border-slate-200 focus:border-[#ff6b35] focus:bg-white focus:ring-4 focus:ring-[#ff6b35]/5"}`}
                                            placeholder="e.g. Saman&apos;s Tuk-Tuk Tours" />
                                        {errors.businessName && <p className="text-[10px] font-bold text-red-500 ml-5">{errors.businessName}</p>}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">What kind of services do you offer?</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {categories.map((c) => {
                                                const Icon = c.icon;
                                                return (
                                                    <button key={c.id} onClick={() => setFormData({ ...formData, category: c.id })}
                                                        className={`p-4 rounded-3xl border-2 transition-all text-left flex items-start space-x-3 group ${formData.category === c.id ? "bg-[#ff6b35]/5 border-[#ff6b35] shadow-lg shadow-[#ff6b35]/10" : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"}`}>
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${formData.category === c.id ? "bg-[#ff6b35] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-bold ${formData.category === c.id ? "text-slate-900" : "text-slate-700"}`}>{c.label}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{c.desc}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.category && <p className="text-[10px] font-bold text-red-500 ml-5">{errors.category}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2 — Contact */}
                        {step === 2 && (
                            <div className="space-y-8 relative">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 mb-2">How can we reach you?</h1>
                                    <p className="text-slate-500 font-medium">Your contact details are used for bookings and verification.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center space-x-2">
                                            <Mail className="w-3 h-3" /> <span>Business Email</span>
                                        </label>
                                        <input type="email" value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full px-5 py-4 bg-slate-50 border rounded-3xl text-sm font-medium transition-all outline-none ${errors.email ? "border-red-300 bg-red-50/10" : "border-slate-200 focus:border-[#ff6b35] focus:bg-white focus:ring-4 focus:ring-[#ff6b35]/5"}`}
                                            placeholder="hello@yourbusiness.lk" />
                                        {errors.email && <p className="text-[10px] font-bold text-red-500 ml-5">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center space-x-2">
                                            <Phone className="w-3 h-3" /> <span>Contact Number (Sri Lanka)</span>
                                        </label>
                                        <input type="tel" value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className={`w-full px-5 py-4 bg-slate-50 border rounded-3xl text-sm font-medium transition-all outline-none ${errors.phone ? "border-red-300 bg-red-50/10" : "border-slate-200 focus:border-[#ff6b35] focus:bg-white focus:ring-4 focus:ring-[#ff6b35]/5"}`}
                                            placeholder="+94 7X XXX XXXX" />
                                        <p className="text-[10px] text-slate-400 ml-5">Format: 07XXXXXXXX or +94 7XXXXXXXX</p>
                                        {errors.phone && <p className="text-[10px] font-bold text-red-500 ml-5">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3 — Summary */}
                        {step === 3 && (
                            <div className="space-y-8 relative">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 mb-2">Almost there!</h1>
                                    <p className="text-slate-500 font-medium">Give us a quick summary of what you do best.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">City or Primary Region</label>
                                        <input type="text" value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className={`w-full px-5 py-4 bg-slate-50 border rounded-3xl text-sm font-medium transition-all outline-none ${errors.location ? "border-red-300 bg-red-50/10" : "border-slate-200 focus:border-[#ff6b35] focus:bg-white focus:ring-4 focus:ring-[#ff6b35]/5"}`}
                                            placeholder="e.g. Galle, Kandy, Colombo Fort..." />
                                        {errors.location && <p className="text-[10px] font-bold text-red-500 ml-5">{errors.location}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Summary</label>
                                        <textarea value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className={`w-full px-5 py-4 bg-slate-50 border rounded-3xl text-sm font-medium transition-all outline-none resize-none ${errors.description ? "border-red-300 bg-red-50/10" : "border-slate-200 focus:border-[#ff6b35] focus:bg-white focus:ring-4 focus:ring-[#ff6b35]/5"}`}
                                            placeholder="What makes your tours or products special? (Min 20 characters)" />
                                        <div className="flex justify-between items-center px-2">
                                            {errors.description
                                                ? <p className="text-[10px] font-bold text-red-500">{errors.description}</p>
                                                : <div />}
                                            <p className={`text-[10px] font-bold ${formData.description.length >= 20 ? "text-emerald-500" : "text-slate-300"}`}>
                                                {formData.description.length}/20 min
                                            </p>
                                        </div>
                                    </div>
                                    {errors.submit && (
                                        <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-2xl border border-red-100">{errors.submit}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 4 — Success */}
                        {step === 4 && (
                            <div className="py-8 space-y-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-1000">
                                <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <div className="space-y-3 max-w-md">
                                    <h1 className="text-3xl font-black text-slate-900 leading-tight">Welcome to the Ceygo family!</h1>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Your application for <span className="font-bold text-slate-800 tracking-tight underline decoration-[#ff6b35] decoration-2 underline-offset-4">{formData.businessName}</span> has been successfully submitted.
                                    </p>
                                </div>
                                <div className="w-full bg-amber-50 rounded-3xl p-6 border border-amber-100 text-left">
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-[2px] mb-4">⏳ Pending Admin Review</p>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</div>
                                            <p className="text-xs text-slate-600 font-medium">Our team will review your application within 1–2 business days.</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</div>
                                            <p className="text-xs text-slate-600 font-medium">Once approved, you&apos;ll get full access to publish gigs and manage orders.</p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href="/partnerdashboard"
                                    className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center group">
                                    <span>Go to Partner Dashboard</span>
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        )}

                        {/* Navigation */}
                        {step < 4 && (
                            <div className="mt-12 flex items-center justify-between">
                                {step > 1 ? (
                                    <button onClick={prevStep}
                                        className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all flex items-center space-x-2">
                                        <ChevronLeft className="w-4 h-4" />
                                        <span>Back</span>
                                    </button>
                                ) : <div />}

                                {step === 3 ? (
                                    <button onClick={handleSubmit} disabled={isSubmitting}
                                        className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center space-x-3 disabled:opacity-70 group">
                                        {isSubmitting ? (
                                            <><Activity className="w-4 h-4 animate-spin" /><span>Submitting…</span></>
                                        ) : (
                                            <><span>Complete Onboarding</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
                                        )}
                                    </button>
                                ) : (
                                    <button onClick={nextStep}
                                        className="px-10 py-3.5 bg-[#ff6b35] text-white rounded-2xl text-sm font-black shadow-xl shadow-[#ff6b35]/20 hover:bg-[#e85a20] transition-all active:scale-[0.98] flex items-center space-x-2 group">
                                        <span>Continue</span>
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="py-8 px-8 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 bg-white">
                <p>&copy; 2026 Ceygo Marketplace &middot; Sri Lanka</p>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Help</a>
                </div>
            </footer>
        </div>
    );
}
