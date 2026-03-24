"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GuidePlaceholder() {
    const router = useRouter();
    
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-6 font-sans text-slate-800">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Guide</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                    This page is currently under construction. Check back soon for exciting updates to the Ceygo platform!
                </p>
                <div className="pt-4">
                    <button onClick={() => router.back()} className="inline-flex items-center justify-center space-x-2 text-sm font-semibold text-slate-600 hover:text-[#ff6b35] transition-colors bg-slate-50 px-6 py-3 rounded-xl border border-slate-100 hover:border-[#ff6b35]/30 w-full group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Go Back</span>
                    </button>
                    <div className="mt-4"><Link href="/" className="text-xs text-slate-400 hover:text-[#ff6b35] transition-colors underline underline-offset-4 font-medium">Return Home</Link></div>
                </div>
            </div>
        </div>
    );
}
