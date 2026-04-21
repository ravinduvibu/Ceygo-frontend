"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Auth Callback Page — OAuth disabled.
 * Redirects straight to dashboard as a fallback.
 */
export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // OAuth is not active. Redirect to sign-in.
        router.replace("/signin");
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#ff6b35] animate-spin" />
                <p className="text-sm font-semibold text-slate-500">Redirecting...</p>
            </div>
        </div>
    );
}
