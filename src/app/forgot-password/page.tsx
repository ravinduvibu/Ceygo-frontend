"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Demo registered accounts (mirrors signin logic)
const REGISTERED_EMAILS = ["traveler@gmail.com", "partner@gmail.com", "admin@gmail.com"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFieldError(value: string): string {
  if (!value.trim()) return "Email address is required.";
  if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
  if (!REGISTERED_EMAILS.includes(value.trim().toLowerCase()))
    return "No account found with this email address.";
  return "";
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fieldError = touched ? getFieldError(email) : "";
  const isValid = getFieldError(email) === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50 relative">

      {/* ── Left Pane ─────────────────────────────────────────── */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sri-lanka-landscape.png"
            alt="Sri Lanka beautiful landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-slate-900/10" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center">
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

        {/* Hero text */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Discover the <span className="text-primary">pearl</span> of the Indian Ocean
          </h1>
          <p className="text-lg text-slate-200">
            Your premium gateway to authentic Sri Lankan experiences, seamless bookings, and unforgettable journeys.
          </p>
        </div>
      </div>

      {/* ── Right Pane ────────────────────────────────────────── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">

        {/* Decorative blobs (mobile) */}
        <div className="absolute top-0 right-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl lg:hidden" />
        <div className="absolute bottom-0 left-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-brand-blue/5 blur-3xl lg:hidden" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* Mobile logo */}
          <div className="flex lg:hidden flex-col items-center mb-4 mt-8">
            <div className="relative h-20 w-48 p-2 drop-shadow-sm">
              <Image
                src="/images/logo_transparent.png"
                alt="Ceygo Logo"
                fill
                className="object-contain p-1 dark:invert"
                priority
              />
            </div>
          </div>

          {!submitted ? (
            /* ── Request form ── */
            <>
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
                  Forgot password?
                </h2>
                <p className="text-sm text-slate-500">
                  No worries — enter your email and we&apos;ll send you reset instructions.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                <form className="space-y-5" noValidate onSubmit={handleSubmit}>

                  {/* ── Email field with inline validation ── */}
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="forgot-email" className="text-sm font-semibold text-slate-700">
                      Email address
                    </label>
                    <div className="relative group">
                      {/* Mail icon */}
                      <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                        fieldError ? "text-red-400" : "text-slate-400 group-focus-within:text-primary"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>

                      <input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (touched) setTouched(true); // re-evaluate live once touched
                        }}
                        onBlur={() => setTouched(true)}
                        className={`w-full pl-11 pr-10 py-3 rounded-xl border text-sm bg-slate-50/50 transition-all focus:outline-none focus:ring-4 ${
                          fieldError
                            ? "border-red-400 bg-red-50/30 focus:border-red-400 focus:ring-red-100 text-red-900 placeholder:text-red-300"
                            : touched && !fieldError
                            ? "border-green-400 bg-green-50/20 focus:border-green-400 focus:ring-green-100"
                            : "border-slate-200 focus:border-primary focus:bg-white focus:ring-primary/10"
                        }`}
                      />

                      {/* Status icon (right side) */}
                      {touched && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {fieldError ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Inline error message */}
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${
                      fieldError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <p className="flex items-center gap-1.5 text-xs font-medium text-red-500 pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldError}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md hover:shadow-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send reset link"
                      )}
                    </button>
                  </div>

                  {/* Hint: valid accounts */}
                  <p className="text-center text-xs text-slate-400">
                    Demo accounts: traveler@gmail.com · partner@gmail.com
                  </p>

                </form>
              </div>

              <div className="text-center">
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            /* ── Success state ── */
            <div className="glass-panel rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-6">

              {/* Animated check icon */}
              <div className="flex items-center justify-center mx-auto w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 animate-[bounce_0.6s_ease-out_1]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">Check your inbox</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-semibold text-slate-700">{email}</span>.
                  <br />It may take a moment to arrive.
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700 font-medium text-left flex gap-2 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Didn&apos;t receive it? Check your spam folder or&nbsp;
                <button
                  onClick={() => { setSubmitted(false); setEmail(""); setTouched(false); }}
                  className="underline underline-offset-2 hover:text-amber-900 transition-colors font-semibold"
                >
                  try again
                </button>.
              </div>

              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to sign in
              </Link>
            </div>
          )}
        </div>

        {/* Security badge */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center lg:justify-start lg:left-12 lg:right-auto opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 bg-slate-100/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-1.998A11.954 11.954 0 0110 1.944zM10 14a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
            </svg>
            <span>Secure SSL Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}
