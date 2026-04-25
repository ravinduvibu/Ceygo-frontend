"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Lock, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// --- Components ---

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-100 last:border-0 gap-3">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <div className="flex items-center space-x-1 sm:space-x-2">
                {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hover || value);
                    return (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => onChange(star)}
                            className="p-1 sm:p-2 transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star
                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${active ? "fill-emerald-400 text-emerald-400" : "fill-slate-100 text-slate-200"
                                    }`}
                            />
                        </button>
                    );
                })}
                <span className="w-12 text-right text-xs font-bold text-slate-400 ml-2">
                    {value > 0 ? `${value}.0` : "Rate"}
                </span>
            </div>
        </div>
    );
}

export default function LeaveReviewPage() {
    const [ratings, setRatings] = useState({
        overall: 0,
        communication: 0,
        service: 0,
    });
    const [publicFeedback, setPublicFeedback] = useState("");
    const [privateFeedback, setPrivateFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const isFormValid = ratings.overall > 0 && ratings.communication > 0 && ratings.service > 0 && publicFeedback.trim().length > 10;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Submitted</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Your verified feedback has been securely logged and attached to transaction <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">#8492</span>. Thank you for keeping the Ceygo community safe and trusted!
                    </p>
                    <Link href="/dashboard" className="block w-full py-4 mt-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">

            {/* Micro-header for navigation context */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center max-w-4xl mx-auto left-0 right-0 z-10">
                <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                </Link>
            </header>

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex justify-center min-h-screen items-center">

                <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">

                    {/* Decorative Top Accent */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400" />

                    {/* ── Header Section ── */}
                    <div className="p-8 sm:p-10 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

                            {/* Thumbnail + Seller Avatar Composition */}
                            <div className="relative flex-shrink-0 group">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white relative z-0">
                                    <Image
                                        src="/images/sigiriya.jpg"
                                        alt="Guided Sigiriya Rock Hike"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                {/* Overlapping Seller Avatar */}
                                <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full border-4 border-white shadow-lg bg-orange-100 flex items-center justify-center z-10 overflow-hidden">
                                    {/* Fallback initials if no image */}
                                    <span className="text-sm font-black text-orange-600">DK</span>
                                </div>
                                {/* Verified Shield floating badge */}
                                <div className="absolute -top-3 -right-3 z-20 bg-white rounded-full p-1 shadow-md">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                                </div>
                            </div>

                            {/* Title Content */}
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center space-x-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Completed Trip</span>
                                    </span>
                                    <span className="text-[10px] sm:text-xs font-mono text-slate-400">#8492</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 pt-1">
                                    Rate your Verified Experience with Dinesh
                                </h1>
                                <p className="text-sm font-medium text-slate-500">
                                    Guided Sigiriya Rock Hike (Sunrise Access)
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="p-8 sm:p-10 space-y-10">

                        {/* ── Rating Breakdown ── */}
                        <section className="space-y-2">
                            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Service Breakdown</h3>
                            <div className="bg-white rounded-2xl border border-slate-100 p-2 sm:p-6 shadow-sm">
                                <RatingRow
                                    label="Overall Experience"
                                    value={ratings.overall}
                                    onChange={(v) => setRatings(prev => ({ ...prev, overall: v }))}
                                />
                                <RatingRow
                                    label="Communication & Responsiveness"
                                    value={ratings.communication}
                                    onChange={(v) => setRatings(prev => ({ ...prev, communication: v }))}
                                />
                                <RatingRow
                                    label="Service as Described"
                                    value={ratings.service}
                                    onChange={(v) => setRatings(prev => ({ ...prev, service: v }))}
                                />
                            </div>
                        </section>

                        {/* ── Written Feedback ── */}
                        <section className="space-y-6">

                            <div className="space-y-3">
                                <label htmlFor="publicFeedback" className="block text-sm font-bold text-slate-700">
                                    Share your public feedback with the Ceygo community
                                </label>
                                <div className="relative group">
                                    <textarea
                                        id="publicFeedback"
                                        rows={4}
                                        value={publicFeedback}
                                        onChange={(e) => setPublicFeedback(e.target.value)}
                                        placeholder="What was the highlight of your trip? How was Dinesh as a guide?"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all resize-none shadow-sm group-hover:border-slate-300"
                                    />
                                    <div className={`absolute bottom-4 right-4 text-[10px] font-bold ${publicFeedback.length > 500 ? 'text-red-400' : 'text-slate-300'}`}>
                                        {publicFeedback.length} / 500
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>This review will appear publicly on Dinesh&apos;s profile.</span>
                                </p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <label htmlFor="privateFeedback" className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
                                    <span>Private feedback for Ceygo Admins</span>
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Optional</span>
                                </label>
                                <textarea
                                    id="privateFeedback"
                                    rows={2}
                                    value={privateFeedback}
                                    onChange={(e) => setPrivateFeedback(e.target.value)}
                                    placeholder="Did anything go wrong? Tell us confidentially..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all resize-none shadow-sm"
                                />
                                <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                                    <Lock className="w-3 h-3" />
                                    <span>Kept strictly confidential. The seller will not see this.</span>
                                </p>
                            </div>

                        </section>
                    </div>

                    {/* ── Footer / Submission ── */}
                    <div className="p-8 sm:p-10 bg-slate-900 text-white rounded-b-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3 text-slate-400 text-sm">
                            <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <p className="leading-tight">
                                <span className="font-bold text-white block">Transaction-Locked Review</span>
                                <span className="text-xs">Booking #8492 Verified Complete</span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 ${isFormValid
                                ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                                : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                                }`}
                        >
                            <span>Submit Verified Review</span>
                            {isFormValid && <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>

                </form>
            </main>

        </div>
    );
}
