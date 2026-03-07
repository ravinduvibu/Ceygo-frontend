"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BarChart3,
    CalendarCheck2,
    Activity,
    Settings,
    ChevronRight,
    Search,
    Bell,
    LogOut,
    Crown,
    Shield,
    UserCircle2,
    Store,
    MoreHorizontal,
    X,
    Lock,
    AlertTriangle,
    Trash2,
    PauseCircle,
    Save,
    ChevronDown,
    Plus,
    Filter,
} from "lucide-react";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────
type Role = "Admin" | "Seller" | "Tourist";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    joined: string;
    role: Role;
    status: "Active" | "Suspended";
    avatar: string;
}

// ── Mock Data ─────────────────────────────────────────────
const users: User[] = [
    { id: 1, name: "Samantha Clarke", email: "s.clarke@email.com", phone: "+1 604 555 0182", joined: "Jan 12, 2026", role: "Admin", status: "Active", avatar: "SC" },
    { id: 2, name: "Nuwan Perera", email: "nuwan.p@ceygo.lk", phone: "+94 77 234 5678", joined: "Feb 3, 2026", role: "Seller", status: "Active", avatar: "NP" },
    { id: 3, name: "Lisa Müller", email: "l.muller@gmail.com", phone: "+49 151 2233 4455", joined: "Jan 28, 2026", role: "Tourist", status: "Active", avatar: "LM" },
    { id: 4, name: "Arjuna Bandara", email: "arjuna.b@lk.net", phone: "+94 71 456 7890", joined: "Feb 14, 2026", role: "Seller", status: "Active", avatar: "AB" },
    { id: 5, name: "Hiroshi Tanaka", email: "h.tanaka@jp.co", phone: "+81 90 1234 5678", joined: "Mar 1, 2026", role: "Tourist", status: "Active", avatar: "HT" },
    { id: 6, name: "Priya Krishnan", email: "priya.k@in.dev", phone: "+91 98765 43210", joined: "Feb 22, 2026", role: "Tourist", status: "Suspended", avatar: "PK" },
    { id: 7, name: "Ravi De Silva", email: "ravi.ds@ceygo.lk", phone: "+94 76 789 0123", joined: "Jan 5, 2026", role: "Admin", status: "Active", avatar: "RD" },
    { id: 8, name: "Emma Thompson", email: "emma.t@uk.io", phone: "+44 7700 900123", joined: "Mar 4, 2026", role: "Tourist", status: "Active", avatar: "ET" },
];

// ── Permission definitions ────────────────────────────────
const permissionGroups = [
    {
        group: "Core Platform",
        perms: [
            { key: "booking", label: "Book Experiences", roles: ["Admin", "Seller", "Tourist"] },
            { key: "profile", label: "Edit Profile & Settings", roles: ["Admin", "Seller", "Tourist"] },
            { key: "reviews", label: "Leave Verified Reviews", roles: ["Admin", "Seller", "Tourist"] },
        ],
    },
    {
        group: "Seller Tools",
        perms: [
            { key: "listings", label: "Manage Listings", roles: ["Admin", "Seller"] },
            { key: "sales_analytics", label: "Sales Analytics Dashboard", roles: ["Admin", "Seller"] },
            { key: "direct_msg", label: "Direct Messaging (Tourists)", roles: ["Admin", "Seller"] },
        ],
    },
    {
        group: "Admin & AI Suite",
        perms: [
            { key: "user_mgmt", label: "User Management & RBAC", roles: ["Admin"] },
            { key: "verification", label: "Seller Verification Audits", roles: ["Admin"] },
            { key: "ai_forecast", label: "AI Forecasting Engine", roles: ["Admin"], locked: true },
            { key: "time_series", label: "Time Series Predictive Data", roles: ["Admin"], locked: true },
            { key: "platform_health", label: "Platform Health Monitor", roles: ["Admin"] },
        ],
    },
];

// ── Role badge ────────────────────────────────────────────
function RoleBadge({ role }: { role: Role }) {
    if (role === "Admin") return (
        <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
            <Crown className="w-2.5 h-2.5 text-amber-400" />
            <span>Administrator</span>
        </span>
    );
    if (role === "Seller") return (
        <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Store className="w-2.5 h-2.5" />
            <span>Seller</span>
        </span>
    );
    return (
        <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
            <UserCircle2 className="w-2.5 h-2.5" />
            <span>Tourist</span>
        </span>
    );
}

// ── Nav sidebar ───────────────────────────────────────────
const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/usermanagement", active: true },
    { icon: ShieldCheck, label: "Seller Verification", href: "/verification", badge: 148 },
    { icon: BarChart3, label: "Analytics", href: "#" },
    { icon: CalendarCheck2, label: "Bookings", href: "#" },
    { icon: Activity, label: "Platform Health", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
];

// Build default toggled state from role
function defaultPerms(role: Role): Record<string, boolean> {
    const state: Record<string, boolean> = {};
    permissionGroups.forEach(({ perms }) =>
        perms.forEach(({ key, roles }) => {
            state[key] = roles.includes(role);
        })
    );
    return state;
}

export default function UserManagement() {
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<Role | "All">("All");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editRole, setEditRole] = useState<Role>("Tourist");
    const [customPerms, setCustomPerms] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState(false);

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "All" || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const openPanel = (u: User) => {
        setSelectedUser(u);
        setEditRole(u.role);
        setCustomPerms(defaultPerms(u.role));
        setSaved(false);
    };

    const handleRoleChange = (role: Role) => {
        setEditRole(role);
        setCustomPerms(defaultPerms(role));
        setSaved(false);
    };

    const togglePerm = (key: string) => {
        setCustomPerms(prev => ({ ...prev, [key]: !prev[key] }));
        setSaved(false);
    };

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
                    {navItems.map(({ icon: Icon, label, active, badge }) => (
                        <button key={label}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active ? "bg-orange-50 text-[#ff6b35] border border-orange-100 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${active ? "text-[#ff6b35]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span>{label}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {badge && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{badge}</span>}
                                {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                            </div>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">SA</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Super Admin</p>
                            <p className="text-xs text-slate-400 truncate">admin@ceygo.lk</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">User Management & Access Control</h1>
                        <p className="text-xs text-slate-400">Role-based permissions · {users.length} system users</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#ff6b35] text-white text-xs font-semibold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add User</span>
                        </button>
                        <button className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b35] rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-hidden flex">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-[1100px] mx-auto space-y-4">

                            {/* Filters */}
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 flex items-center space-x-2 bg-white rounded-xl px-3 py-2.5 border border-slate-200 shadow-sm">
                                    <Search className="w-4 h-4 text-slate-400" />
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
                                        placeholder="Search by name or email..."
                                    />
                                </div>
                                <div className="flex items-center space-x-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                                    <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
                                    {(["All", "Admin", "Seller", "Tourist"] as const).map(r => (
                                        <button key={r} onClick={() => setFilterRole(r)}
                                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${filterRole === r ? "bg-[#ff6b35] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                                                }`}
                                        >{r}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Administrators", count: users.filter(u => u.role === "Admin").length, color: "bg-slate-900", text: "text-white", icon: Crown },
                                    { label: "Sellers", count: users.filter(u => u.role === "Seller").length, color: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", icon: Store },
                                    { label: "Tourists", count: users.filter(u => u.role === "Tourist").length, color: "bg-blue-50 border border-blue-200", text: "text-blue-600", icon: UserCircle2 },
                                ].map(({ label, count, color, text, icon: Icon }) => (
                                    <div key={label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-5 h-5 ${text}`} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900">{count}</p>
                                            <p className="text-xs text-slate-400">{label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-900">System Users &amp; Access Control</h2>
                                    <span className="text-xs text-slate-400">{filtered.length} users</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60">
                                                {["User", "Contact Info", "Join Date", "Assigned Role", "Status", "Actions"].map(h => (
                                                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filtered.map(u => (
                                                <tr key={u.id}
                                                    className={`hover:bg-slate-50 transition-colors ${selectedUser?.id === u.id ? "bg-orange-50/50" : ""}`}
                                                >
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#0ea5e9]/20 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 border border-slate-200">
                                                                {u.avatar}
                                                            </div>
                                                            <p className="text-sm font-semibold text-slate-800 whitespace-nowrap">{u.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-xs text-slate-600">{u.email}</p>
                                                        <p className="text-[10px] text-slate-400">{u.phone}</p>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-xs text-slate-600 whitespace-nowrap">{u.joined}</p>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <RoleBadge role={u.role} />
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"
                                                            }`}>{u.status}</span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <button
                                                            onClick={() => openPanel(u)}
                                                            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#ff6b35]/10 text-[#ff6b35] hover:bg-[#ff6b35]/20 transition-colors border border-[#ff6b35]/20"
                                                        >
                                                            Edit Permissions
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Slide-Over Permissions Panel ── */}
                    {selectedUser && (
                        <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white shadow-xl flex flex-col overflow-hidden">
                            {/* Panel header */}
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Edit User Permissions</h2>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{selectedUser.name}</p>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            {/* Role selector */}
                            <div className="px-5 py-4 border-b border-slate-100">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assigned Role</label>
                                <div className="relative mt-1.5">
                                    <select
                                        value={editRole}
                                        onChange={e => handleRoleChange(e.target.value as Role)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                                    >
                                        <option>Tourist</option>
                                        <option>Seller</option>
                                        <option>Admin</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="mt-2">
                                    <RoleBadge role={editRole} />
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                                {permissionGroups.map(({ group, perms }) => (
                                    <div key={group}>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{group}</p>
                                        <div className="space-y-2">
                                            {perms.map(({ key, label, locked }) => {
                                                const isOn = !!customPerms[key];
                                                // locked:true AND not admin = hard locked, non-interactive
                                                const hardLocked = !!locked && editRole !== "Admin";
                                                return (
                                                    <div key={key}
                                                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${hardLocked
                                                                ? "bg-slate-50 opacity-50"
                                                                : isOn
                                                                    ? "bg-emerald-50/60 border border-emerald-100"
                                                                    : "bg-slate-50 border border-slate-100"
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                            {hardLocked
                                                                ? <Lock className="w-3 h-3 text-slate-300 flex-shrink-0" />
                                                                : isOn
                                                                    ? <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                                                    : <AlertTriangle className="w-3 h-3 text-slate-300 flex-shrink-0" />
                                                            }
                                                            <span className={`text-xs font-medium truncate ${hardLocked ? "text-slate-300" : isOn ? "text-slate-700" : "text-slate-400"
                                                                }`}>
                                                                {label}
                                                            </span>
                                                            {locked && (
                                                                <span className="text-[9px] font-bold text-slate-300 bg-slate-100 px-1 py-0.5 rounded ml-1 flex-shrink-0">Admin only</span>
                                                            )}
                                                        </div>
                                                        {/* Clickable Toggle */}
                                                        <button
                                                            disabled={hardLocked}
                                                            onClick={() => !hardLocked && togglePerm(key)}
                                                            className={`relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ml-2 ${hardLocked
                                                                    ? "bg-slate-200 cursor-not-allowed"
                                                                    : isOn
                                                                        ? "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                                                                        : "bg-slate-200 hover:bg-slate-300 cursor-pointer"
                                                                }`}
                                                        >
                                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isOn ? "translate-x-4" : "translate-x-0.5"
                                                                }`} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div className="px-5 py-4 border-t border-slate-100 space-y-2">
                                {saved ? (
                                    <div className="flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Role saved successfully!</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setSaved(true)}
                                        className="w-full py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200 flex items-center justify-center space-x-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save Role</span>
                                    </button>
                                )}
                                <button className="w-full py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 hover:bg-amber-100 transition-colors flex items-center justify-center space-x-2">
                                    <PauseCircle className="w-3.5 h-3.5" />
                                    <span>Suspend Account</span>
                                </button>
                                <button className="w-full py-2 rounded-xl bg-slate-50 text-red-500 text-xs font-semibold border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center space-x-2">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Revoke Access</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
