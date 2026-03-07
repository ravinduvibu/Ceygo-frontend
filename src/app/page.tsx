"use client";

import Image from "next/image";
import { useState } from "react";
import RoleToggle from "@/components/RoleToggle";
import Input from "@/components/Input";

export default function Home() {
  const [role, setRole] = useState("Traveler");

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50">
      {/* Left Pane - Brand / Hero */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sri-lanka-landscape.png"
            alt="Sri Lanka beautiful landscape"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle gradient overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-slate-900/10" />
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

        <div className="relative z-10 space-y-4 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Discover the <span className="text-primary">pearl</span> of the Indian Ocean
          </h1>
          <p className="text-lg text-slate-200">
            Your premium gateway to authentic Sri Lankan experiences, seamless bookings, and unforgettable journeys.
          </p>

          <div className="flex space-x-4 pt-4">
            {/* Small avatars/social proof could go here */}
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
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">

        {/* Decorative Background Elements for mobile/light theme */}
        <div className="absolute top-0 right-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl lg:hidden" />
        <div className="absolute bottom-0 left-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-brand-blue/5 blur-3xl lg:hidden" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* Mobile Header (Hidden on Desktop) */}
          <div className="flex lg:hidden flex-col items-center space-y-4 mb-4 mt-8">
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

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <div className="mb-8">
              <RoleToggle
                roles={["Traveler", "Partner"]}
                defaultRole={role}
                onRoleChange={setRole}
              />
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md hover:shadow-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
                >
                  Sign in as {role}
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 text-xs font-medium text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
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

          <div className="text-center pt-4">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <a href="#" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Sign up
              </a>
            </p>
          </div>

        </div>

        {/* Security Badge Footer */}
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
