"use client";

import { MessageSquare } from "lucide-react";
import TravelerSidebar from "@/components/TravelerSidebar";

export default function MessagesPage() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            {/* ── Reusable Dynamic Sidebar ── */}
            <TravelerSidebar activePage="Message Artisan" />

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Message Artisan</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Communicate with verified local guides and hosts.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
                        <MessageSquare className="w-16 h-16 text-slate-300" />
                        <h2 className="text-lg font-bold text-slate-700">Messages Coming Soon</h2>
                        <p className="text-slate-500 text-sm max-w-sm text-center">
                            We&apos;re building a secure, translation-enabled messaging platform to connect you directly with local artisans.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
