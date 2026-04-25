"use client";

import { useState, useRef } from "react";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BarChart3,
    CalendarCheck2,
    Settings,
    Star,
    ChevronRight,
    LogOut,
    Lock,
    Server,
    UserCircle2,
    Camera,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertTriangle,
    Save,
    Mail,
    User,
    KeyRound,
    Percent,
    Crown,
    Store,
    Building,
    Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: false, alert: 0, href: "/admin" },
    { icon: Users, label: "User Management", active: false, alert: 0, href: "/usermanagement" },
    { icon: ShieldCheck, label: "Seller Verification", active: false, alert: 7, href: "/verification" },
    { icon: BarChart3, label: "Analytics", active: false, alert: 0, href: "/forecasting" },
    { icon: CalendarCheck2, label: "Bookings", active: false, alert: 0, href: "/bookings" },
    { icon: Star, label: "Verified Reviews", active: false, alert: 1, href: "/verified-reviews/admin" },
    { icon: Settings, label: "Settings", active: true, alert: 0, href: "/settings/admin" },
];

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("profile");

    // ── Profile state ─────────────────────────────────────
    const [profileName, setProfileName] = useState("Super Admin");
    const [profileEmail, setProfileEmail] = useState("admin@ceygo.lk");
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const [profileSaved, setProfileSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
    };

    // ── Password state ────────────────────────────────────
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwSaved, setPwSaved] = useState(false);
    const [pwError, setPwError] = useState("");

    const pwStrength = !newPw ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) && /[^a-zA-Z0-9]/.test(newPw) ? 4 : 3;
    const pwStrengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
    const pwStrengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-400"][pwStrength];

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        setPwError("");
        if (!currentPw) { setPwError("Please enter your current password."); return; }
        if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
        if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
        setPwSaved(true);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
        setTimeout(() => setPwSaved(false), 3000);
    };

    // ── Maintenance toggle ────────────────────────────────
    const [maintenance, setMaintenance] = useState(false);

    // ── Security policy state ─────────────────────────────
    const [twoFA, setTwoFA] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState("30");
    const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
    const [requireUppercase, setRequireUppercase] = useState(true);
    const [requireSpecial, setRequireSpecial] = useState(true);
    const [minPwLength, setMinPwLength] = useState("8");
    const [securitySaved, setSecuritySaved] = useState(false);
    const handleSecuritySave = () => { setSecuritySaved(true); setTimeout(() => setSecuritySaved(false), 3000); };

    // ── Commission tiers state ────────────────────────────
    const [tiers, setTiers] = useState([
        { id: "bronze",     label: "Bronze",     icon: Store,    color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",   rate: "8" },
        { id: "silver",     label: "Silver",     icon: Star,     color: "text-slate-600",   bg: "bg-slate-50 border-slate-200",   rate: "12" },
        { id: "gold",       label: "Gold",       icon: Crown,    color: "text-yellow-600",  bg: "bg-yellow-50 border-yellow-200", rate: "15" },
        { id: "enterprise", label: "Enterprise", icon: Building, color: "text-blue-700",    bg: "bg-blue-50 border-blue-200",     rate: "20" },
    ]);
    const [tiersSaved, setTiersSaved] = useState(false);
    const handleTierChange = (id: string, val: string) => setTiers(prev => prev.map(t => t.id === id ? { ...t, rate: val } : t));
    const handleTiersSave = () => { setTiersSaved(true); setTimeout(() => setTiersSaved(false), 3000); };

    const tabs = [
        { id: "profile",  label: "Profile & Account",  icon: UserCircle2 },
        { id: "general",  label: "General Config",      icon: Settings },
        { id: "security", label: "Security Policies",   icon: ShieldCheck },
        { id: "fees",     label: "Commission Tiers",    icon: Server },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                    <div className="relative h-9 w-28">
                        <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                    </div>
                    <span className="text-[10px] font-bold text-[#ff6b35] tracking-widest uppercase bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                        Admin
                    </span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, active, alert, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                ? "bg-orange-50 text-[#ff6b35] border border-orange-100 shadow-sm"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${active ? "text-[#ff6b35]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span>{label}</span>
                            </div>
                            {alert > 0 && (
                                <span className="text-xs font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">{alert}</span>
                            )}
                            {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl group">
                        {/* Live avatar preview in sidebar */}
                        {avatarSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarSrc} alt="avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {profileName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{profileName}</p>
                            <p className="text-xs text-slate-400 truncate">{profileEmail}</p>
                        </div>
                        <Link
                            href="/"
                            onClick={async () => { await fetch("/api/auth/set-role", { method: "DELETE" }); window.location.replace("/signin"); }}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-auto"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Admin Settings</h1>
                        <p className="text-xs text-slate-400">Manage your account, profile, and platform configuration.</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="max-w-[1000px] mx-auto flex space-x-8">

                        {/* Tabs Navigation */}
                        <div className="w-56 flex-shrink-0 space-y-1">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === id
                                        ? "bg-white text-[#ff6b35] shadow-sm border border-slate-200"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Settings Content Pane */}
                        <div className="flex-1 space-y-5">

                            {/* ── PROFILE TAB ── */}
                            {activeTab === "profile" && (
                                <div className="space-y-5">

                                    {/* Avatar + Name + Email */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center space-x-2">
                                            <User className="w-4 h-4 text-[#ff6b35]" />
                                            <span>Profile Information</span>
                                        </h2>

                                        <form onSubmit={handleProfileSave} className="space-y-6">
                                            {/* Avatar upload */}
                                            <div className="flex items-center space-x-6">
                                                <div className="relative flex-shrink-0">
                                                    {avatarSrc ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={avatarSrc} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm" />
                                                    ) : (
                                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center shadow-sm">
                                                            <span className="text-2xl font-black text-white">
                                                                {profileName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#ff6b35] text-white flex items-center justify-center shadow-md hover:bg-[#e55a2b] transition-colors border-2 border-white"
                                                    >
                                                        <Camera className="w-3.5 h-3.5" />
                                                    </button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleAvatarChange}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Profile Photo</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or GIF · Max 2MB</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="mt-2 text-xs font-semibold text-[#ff6b35] hover:underline"
                                                    >
                                                        Upload new photo
                                                    </button>
                                                    {avatarSrc && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setAvatarSrc(null)}
                                                            className="mt-2 ml-3 text-xs font-semibold text-slate-400 hover:text-red-500 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center space-x-1.5">
                                                    <User className="w-3 h-3" /><span>Full Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileName}
                                                    onChange={e => { setProfileName(e.target.value); setProfileSaved(false); }}
                                                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/60 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800"
                                                    placeholder="e.g. Super Admin"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center space-x-1.5">
                                                    <Mail className="w-3 h-3" /><span>Email Address</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileEmail}
                                                    onChange={e => { setProfileEmail(e.target.value); setProfileSaved(false); }}
                                                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/60 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800"
                                                    placeholder="e.g. admin@ceygo.lk"
                                                />
                                            </div>

                                            <div className="pt-2 flex items-center space-x-3">
                                                {profileSaved ? (
                                                    <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Profile updated successfully!</span>
                                                    </div>
                                                ) : (
                                                    <button type="submit" className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                                                        <Save className="w-4 h-4" />
                                                        <span>Save Profile</span>
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Password Change */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center space-x-2">
                                            <KeyRound className="w-4 h-4 text-[#ff6b35]" />
                                            <span>Change Password</span>
                                        </h2>

                                        <form onSubmit={handlePasswordSave} className="space-y-5">
                                            {/* Current password */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type={showCurrent ? "text" : "password"}
                                                        value={currentPw}
                                                        onChange={e => { setCurrentPw(e.target.value); setPwError(""); setPwSaved(false); }}
                                                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 outline-none focus:border-[#ff6b35]/60 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all text-slate-800"
                                                        placeholder="Enter current password"
                                                    />
                                                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* New password */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type={showNew ? "text" : "password"}
                                                        value={newPw}
                                                        onChange={e => { setNewPw(e.target.value); setPwError(""); setPwSaved(false); }}
                                                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 outline-none focus:border-[#ff6b35]/60 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all text-slate-800"
                                                        placeholder="At least 8 characters"
                                                    />
                                                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {/* Strength meter */}
                                                {newPw && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex space-x-1">
                                                            {[1, 2, 3, 4].map(i => (
                                                                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength ? pwStrengthColor : "bg-slate-100"}`} />
                                                            ))}
                                                        </div>
                                                        <p className={`text-[10px] font-bold ${["", "text-red-500", "text-amber-500", "text-blue-500", "text-emerald-600"][pwStrength]}`}>
                                                            {pwStrengthLabel}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Confirm password */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type={showConfirm ? "text" : "password"}
                                                        value={confirmPw}
                                                        onChange={e => { setConfirmPw(e.target.value); setPwError(""); setPwSaved(false); }}
                                                        className={`w-full text-sm bg-slate-50 border rounded-xl pl-10 pr-10 py-3 outline-none transition-all text-slate-800 ${confirmPw && confirmPw !== newPw ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-[#ff6b35]/60 focus:ring-2 focus:ring-[#ff6b35]/10"}`}
                                                        placeholder="Repeat new password"
                                                    />
                                                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {confirmPw && confirmPw !== newPw && (
                                                    <p className="text-[11px] text-red-500 font-medium flex items-center space-x-1">
                                                        <AlertTriangle className="w-3 h-3" /><span>Passwords don&apos;t match</span>
                                                    </p>
                                                )}
                                                {confirmPw && confirmPw === newPw && newPw.length >= 8 && (
                                                    <p className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
                                                        <CheckCircle2 className="w-3 h-3" /><span>Passwords match</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Error / Success */}
                                            {pwError && (
                                                <div className="flex items-center space-x-2 text-sm font-medium text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                    <span>{pwError}</span>
                                                </div>
                                            )}
                                            {pwSaved && (
                                                <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Password changed successfully!</span>
                                                </div>
                                            )}

                                            <div className="pt-1">
                                                <button type="submit" className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors shadow-sm">
                                                    <KeyRound className="w-4 h-4" />
                                                    <span>Update Password</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* ── GENERAL TAB ── */}
                            {activeTab === "general" && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                                    <h2 className="text-base font-bold text-slate-900">General System Settings</h2>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">Maintenance Mode</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Disables site access for tourists and sellers while active.</p>
                                        </div>
                                        <button
                                            onClick={() => setMaintenance(v => !v)}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${maintenance ? "bg-[#ff6b35]" : "bg-slate-200"}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${maintenance ? "translate-x-5" : "translate-x-0"}`} />
                                        </button>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Admin Email Contact</label>
                                        <input defaultValue="admin@ceygo.lk" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Platform Region Restriction</label>
                                        <select className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800 appearance-none">
                                            <option>Global (All regions)</option>
                                            <option>Sri Lanka Focus Mode</option>
                                        </select>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                                        <button className="px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200 flex items-center space-x-2">
                                            <Lock className="w-4 h-4" />
                                            <span>Save & Apply System-wide</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── SECURITY POLICIES TAB ── */}
                            {activeTab === "security" && (
                                <div className="space-y-5">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                                        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                                            <ShieldCheck className="w-4 h-4 text-[#ff6b35]" />
                                            <span>Authentication & Access</span>
                                        </h2>

                                        {/* 2FA */}
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Require OTP for all admin logins.</p>
                                            </div>
                                            <button onClick={() => setTwoFA(v => !v)} className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${twoFA ? "bg-[#ff6b35]" : "bg-slate-200"}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${twoFA ? "translate-x-5" : "translate-x-0"}`} />
                                            </button>
                                        </div>

                                        {/* Session timeout */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Session Timeout (minutes)</label>
                                            <select
                                                value={sessionTimeout}
                                                onChange={e => setSessionTimeout(e.target.value)}
                                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800 appearance-none"
                                            >
                                                {["15", "30", "60", "120", "Never"].map(v => <option key={v}>{v}</option>)}
                                            </select>
                                        </div>

                                        {/* Max login attempts */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Max Failed Login Attempts (before lockout)</label>
                                            <select
                                                value={maxLoginAttempts}
                                                onChange={e => setMaxLoginAttempts(e.target.value)}
                                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800 appearance-none"
                                            >
                                                {["3", "5", "10"].map(v => <option key={v}>{v}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                                        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                                            <Lock className="w-4 h-4 text-[#ff6b35]" />
                                            <span>Password Policy</span>
                                        </h2>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Minimum Password Length</label>
                                            <select
                                                value={minPwLength}
                                                onChange={e => setMinPwLength(e.target.value)}
                                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff6b35]/50 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-semibold text-slate-800 appearance-none"
                                            >
                                                {["6", "8", "10", "12"].map(v => <option key={v}>{v} characters</option>)}
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Require Uppercase Letter</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Password must contain at least one uppercase character.</p>
                                            </div>
                                            <button onClick={() => setRequireUppercase(v => !v)} className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${requireUppercase ? "bg-[#ff6b35]" : "bg-slate-200"}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${requireUppercase ? "translate-x-5" : "translate-x-0"}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Require Special Character</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Password must include at least one symbol (e.g. !@#$).</p>
                                            </div>
                                            <button onClick={() => setRequireSpecial(v => !v)} className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${requireSpecial ? "bg-[#ff6b35]" : "bg-slate-200"}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${requireSpecial ? "translate-x-5" : "translate-x-0"}`} />
                                            </button>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                                            {securitySaved ? (
                                                <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                                                    <CheckCircle2 className="w-4 h-4" /><span>Security policies saved!</span>
                                                </div>
                                            ) : (
                                                <button onClick={handleSecuritySave} className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                                                    <Save className="w-4 h-4" /><span>Save Security Policies</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── COMMISSION TIERS TAB ── */}
                            {activeTab === "fees" && (
                                <div className="space-y-5">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
                                            <Percent className="w-4 h-4 text-[#ff6b35]" />
                                            <span>Commission Tiers</span>
                                        </h2>
                                        <p className="text-xs text-slate-400 mb-6">Set the platform commission rate (%) applied per completed booking for each seller tier.</p>

                                        <div className="space-y-4">
                                            {tiers.map(({ id, label, icon: Icon, color, bg, rate }) => (
                                                <div key={id} className={`flex items-center justify-between p-4 rounded-xl border ${bg}`}>
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm`}>
                                                            <Icon className={`w-4 h-4 ${color}`} />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-bold ${color}`}>{label} Seller</p>
                                                            <p className="text-[10px] text-slate-400">Commission applied on each booking</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={rate}
                                                                onChange={e => handleTierChange(id, e.target.value)}
                                                                className="w-20 text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 pr-7 outline-none focus:border-[#ff6b35]/60 focus:ring-2 focus:ring-[#ff6b35]/10 transition-all font-bold text-slate-800 text-right"
                                                            />
                                                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Summary table */}
                                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center space-x-1.5 mb-3">
                                                <Sparkles className="w-3.5 h-3.5 text-[#ff6b35]" />
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Revenue Preview (per LKR 10,000 booking)</p>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3">
                                                {tiers.map(({ id, label, color, rate }) => (
                                                    <div key={id} className="text-center">
                                                        <p className={`text-lg font-black ${color}`}>LKR {(100 * (parseFloat(rate) || 0)).toLocaleString()}</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-5 border-t border-slate-100 flex items-center space-x-3">
                                            {tiersSaved ? (
                                                <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                                                    <CheckCircle2 className="w-4 h-4" /><span>Commission tiers saved!</span>
                                                </div>
                                            ) : (
                                                <button onClick={handleTiersSave} className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                                                    <Save className="w-4 h-4" /><span>Save Commission Tiers</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
