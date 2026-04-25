"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, User, Loader2, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // ── Mock Admin Auth ───────────────────────────────
        setTimeout(() => {
            if (email === "admin@gmail.com" && password === "admin12345678") {
                document.cookie = "auth=true; path=/";
                window.location.href = "/admin";
            } else {
                setError("Invalid admin credentials. Use admin@gmail.com / admin12345678");
            }
            setIsLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 selection:bg-orange-500 selection:text-white">
            {/* Subtle background patterns */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -ml-24 -mb-24" />
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-6 group transition-all hover:scale-105 duration-500 border border-slate-100">
                        <Lock className="w-9 h-9 text-orange-500 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Ceygo Admin</h1>
                    <p className="text-slate-500 mt-3 font-semibold">Central Administrative Authority</p>
                </div>

                {/* Login Card */}
                <div className="bg-white border border-slate-200/60 rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <form onSubmit={handleLogin} className="space-y-7">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
                                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-red-600 uppercase tracking-widest">Access Warning</p>
                                    <p className="text-xs text-red-500 font-bold leading-relaxed">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2.5">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
                                    Admin Identifier
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4.5 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-8 focus:ring-orange-500/5 transition-all outline-none"
                                        placeholder="admin@gmail.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2.5">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
                                    Security Key
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4.5 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-8 focus:ring-orange-500/5 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 transition-all text-white font-black py-4.5 rounded-2xl shadow-xl shadow-orange-200 active:scale-[0.97] flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Log In Phase
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

                {/* Footer link */}
                <div className="text-center mt-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                    <p className="text-slate-400 text-sm font-bold">
                        Unauthorized access is prohibited. <span onClick={() => router.push("/login")} className="text-orange-500 hover:text-orange-600 transition-colors cursor-pointer font-black ml-1">Exit</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
