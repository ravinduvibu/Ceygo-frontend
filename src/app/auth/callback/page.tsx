"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // The real code exchange happens in /api/auth/callback (Route Handler).
    // This page is shown while Supabase redirects back with a code param.
    // If somehow a user lands here without a code, send them to sign-in.
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/signin");
    }
    // With a code present the browser will be redirected by the Route Handler
    // at /api/auth/callback before this component fully renders.
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#ff6b35] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Completing sign in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#ff6b35] animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
