"use client";

import { BookOpen } from "lucide-react";
import TravelerSidebar from "@/components/TravelerSidebar";

export default function GuidePage() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {/* ── Reusable Dynamic Sidebar ── */}
            <TravelerSidebar activePage="Platform Guide" />

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Platform Guide</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Learn how to make the most out of your Ceygo experience.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
                        <BookOpen className="w-16 h-16 text-slate-300" />
                        <h2 className="text-lg font-bold text-slate-700">Guide Coming Soon</h2>
                        <p className="text-slate-500 text-sm max-w-sm text-center">
                            We&apos;re putting together comprehensive resources on ethical travel, direct payments, and verified safety protocols.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
