"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RoleToggle from "@/components/RoleToggle";
import Input from "@/components/Input";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [role, setRole] = useState("Traveler");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const pwStrength = !password ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4 : 3;
  const pwStrengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const pwStrengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-400"][pwStrength];

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50 relative">
      {/* Toast Popup */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${error ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white shadow-2xl shadow-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide">{error}</span>
        </div>
      </div>

      {/* Success Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${success ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-emerald-900/95 backdrop-blur-md text-white shadow-2xl shadow-emerald-900/40 border border-emerald-800">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide">Account created! Redirecting...</span>
        </div>
      </div>

      {/* Left Pane - Brand / Hero */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sri-lanka-landscape.png"
            alt="Sri Lanka beautiful landscape"
            fill
            className="object-cover scale-105"
            priority
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
        </div>

        {/* Content Over Image */}
        <div className="relative z-10 flex flex-col items-start space-y-2">
          <div className="flex items-center">
            <div className="relative h-20 w-48 p-2">
              <Image
                src="/images/logo_transparent.png"
                alt="Ceygo Logo"
                fill
                className="object-contain p-1 invert dark:invert-0 drop-shadow-md"
                priority
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-2">
             <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
             <span className="text-xs font-bold text-white uppercase tracking-wider">Join the community</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Start your <span className="text-primary">journey</span> with us today
          </h1>
          <p className="text-lg text-slate-200">
            Create an account to unlock premium experiences, seamless bookings, and exclusive authentic local guides in Sri Lanka.
          </p>

          <div className="flex space-x-4 pt-6">
            <div className="flex -space-x-3">
              <div className="relative h-10 w-10 rounded-full border-2 border-slate-900 overflow-hidden shadow-sm">
                <Image src="/images/traveler1.png" alt="Traveler" fill className="object-cover" />
              </div>
              <div className="relative h-10 w-10 rounded-full border-2 border-slate-900 overflow-hidden shadow-sm">
                <Image src="/images/traveler3.png" alt="Traveler" fill className="object-cover" />
              </div>
              <div className="relative h-10 w-10 rounded-full border-2 border-slate-900 overflow-hidden shadow-sm">
                <Image src="/images/traveler2.png" alt="Traveler" fill className="object-cover" />
              </div>
            </div>
            <p className="text-sm text-slate-300 flex items-center font-medium">
              Join 10k+ <br /> happy travelers
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl lg:hidden" />
        <div className="absolute bottom-0 left-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-brand-blue/5 blur-3xl lg:hidden" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Mobile Header */}
          <div className="flex lg:hidden flex-col items-center space-y-4 mb-2 mt-4">
            <div className="relative h-16 w-40 p-2 drop-shadow-sm">
              <Image
                src="/images/logo_transparent.png"
                alt="Ceygo Logo"
                fill
                className="object-contain p-1 dark:invert"
                priority
              />
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
              Create an account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Join Ceygo and start {role === "Partner" ? "hosting" : "exploring"} today.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <div className="mb-6">
              <RoleToggle
                roles={["Traveler", "Partner"]}
                defaultRole={role}
                onRoleChange={setRole}
              />
            </div>

            <form className="space-y-4" noValidate onSubmit={(e) => {
              e.preventDefault();
              setError("");

              const cleanName = name.trim();
              const cleanEmail = email.trim();
              const cleanPassword = password.trim();

              if (!cleanName) { setError("Full name is required."); return; }
              if (!cleanEmail) { setError("Email is required."); return; }
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(cleanEmail)) { setError("Please enter a valid email address."); return; }
              if (!cleanPassword) { setError("Password is required."); return; }
              if (cleanPassword.length < 8) { setError("Password must be at least 8 characters long."); return; }
              if (cleanPassword !== confirmPassword) { setError("Passwords do not match."); return; }

              // Mock success registration
              setSuccess(true);
              setTimeout(() => {
                  document.cookie = "auth=true; path=/";
                  if (role === "Partner") router.push("/partnerdashboard");
                  else router.push("/dashboard");
              }, 1500);

            }}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength meter */}
                {password && (
                    <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center space-x-2">
                        <span>Strength: <strong className={pwStrengthColor.replace('bg-', 'text-')}>{pwStrengthLabel}</strong></span>
                        <div className="flex-1 flex gap-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${pwStrength >= 1 ? pwStrengthColor : 'bg-transparent'}`} style={{ width: '25%' }} />
                            <div className={`h-full transition-all duration-300 ${pwStrength >= 2 ? pwStrengthColor : 'bg-transparent'}`} style={{ width: '25%' }} />
                            <div className={`h-full transition-all duration-300 ${pwStrength >= 3 ? pwStrengthColor : 'bg-transparent'}`} style={{ width: '25%' }} />
                            <div className={`h-full transition-all duration-300 ${pwStrength >= 4 ? pwStrengthColor : 'bg-transparent'}`} style={{ width: '25%' }} />
                        </div>
                    </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:border-red-400 text-red-900 bg-red-50/30' 
                        : confirmPassword && password === confirmPassword
                        ? 'border-emerald-300 focus:border-emerald-400 text-emerald-900 bg-emerald-50/30'
                        : 'border-slate-200 focus:border-primary focus:bg-white'
                    }`}
                    placeholder="Repeat password"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md hover:shadow-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
                >
                  Sign up as {role}
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 text-xs font-medium text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.72 1.58.12 2.94.81 3.76 2.01-3.22 1.96-2.73 5.42.42 6.64-.78 1.95-1.92 3.36-2.85 4.24zm-3.32-14.1c-.08-1.78 1.4-3.4 3.19-3.52.26 1.84-1.33 3.5-3.19 3.52z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge Footer */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center lg:justify-start lg:left-12 lg:right-auto opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 bg-slate-100/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-1.998A11.954 11.954 0 0110 1.944zM10 14a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
            </svg>
            <span>Secure SSL Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
