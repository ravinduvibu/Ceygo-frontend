"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/**
 * Auth Callback Page
 * 
 * Google OAuth redirects here after login/signup.
 * We read the session, check the user's role from metadata,
 * and redirect to the correct dashboard.
 */
export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            // Wait for Supabase to process the OAuth session from the URL hash
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                router.replace("/signin");
                return;
            }

            let userRole = session.user?.user_metadata?.role || "Traveler";

            // ── SIGNUP FLOW: apply a pending role if user signed up via Google ──
            const pendingSignupRole = localStorage.getItem('pending_google_role');
            if (pendingSignupRole && pendingSignupRole !== userRole) {
                // New Google signup — apply the role they selected before OAuth
                await supabase.auth.updateUser({ data: { role: pendingSignupRole } });
                await supabase
                    .from('users')
                    .update({ role: pendingSignupRole })
                    .eq('id', session.user.id);
                userRole = pendingSignupRole;
            }
            localStorage.removeItem('pending_google_role');

            // ── SIGNIN FLOW: enforce the role toggle they selected on signin page ──
            const pendingSigninRole = localStorage.getItem('pending_signin_role');
            localStorage.removeItem('pending_signin_role');

            if (pendingSigninRole && userRole !== "Admin") {
                // If the account role doesn't match what was selected on the toggle → block
                if (userRole !== pendingSigninRole) {
                    // Sign them out so they don't stay logged in
                    await supabase.auth.signOut();
                    router.replace(
                        `/signin?error=${encodeURIComponent(
                            `This account is registered as a ${userRole}. Please select the correct role to sign in.`
                        )}`
                    );
                    return;
                }
            }

            document.cookie = "auth=true; path=/";

            if (userRole === "Admin") {
                router.replace("/admin");
            } else if (userRole === "Partner") {
                router.replace("/partnerdashboard");
            } else {
                router.replace("/dashboard");
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center space-y-4">
                {/* Animated spinner */}
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#ff6b35] animate-spin" />
                <p className="text-sm font-semibold text-slate-500">Signing you in...</p>
            </div>
        </div>
    );
}
