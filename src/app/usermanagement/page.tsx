"use client";

import { useState, useRef, useEffect } from "react";
import {
    Search,
    Bell,
    Crown,
    UserCircle2,
    Store,
    X,
    Lock,
    AlertTriangle,
    Trash2,
    PauseCircle,
    Save,
    ChevronDown,
    Plus,
    Filter,
    CheckCheck,
    UserPlus,
    ShieldAlert,
    TrendingUp,
    ShieldCheck,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

// ── Types ─────────────────────────────────────────────────
type Role = "Admin" | "Seller" | "Tourist";

interface User {
    id: string;
    name: string;
    email: string;
    joined: string;
    role: Role;
    status: "Active" | "Suspended";
    avatar: string;
}

// Map DB roles to display roles
function toDisplayRole(dbRole: string): Role {
    if (dbRole === "admin") return "Admin";
    if (dbRole === "partner") return "Seller";
    return "Tourist";
}
function toDbRole(displayRole: Role): string {
    if (displayRole === "Admin") return "admin";
    if (displayRole === "Seller") return "partner";
    return "traveler";
}
function formatJoinDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

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

// ── Notification types ───────────────────────────────────
interface Notification {
    id: number;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    title: string;
    desc: string;
    time: string;
    read: boolean;
}

const initialNotifications: Notification[] = [
    { id: 1, icon: UserPlus,    iconColor: "text-blue-600",    iconBg: "bg-blue-50",    title: "New user registered",        desc: "Hiroshi Tanaka joined as Tourist",            time: "2 min ago",  read: false },
    { id: 2, icon: ShieldAlert, iconColor: "text-amber-600",  iconBg: "bg-amber-50",  title: "Seller verification pending", desc: "3 sellers awaiting audit approval",           time: "18 min ago", read: false },
    { id: 3, icon: TrendingUp,  iconColor: "text-emerald-600",iconBg: "bg-emerald-50",title: "Platform milestone reached",   desc: "500 verified bookings this month!",          time: "1 hr ago",   read: false },
    { id: 4, icon: UserPlus,    iconColor: "text-blue-600",   iconBg: "bg-blue-50",   title: "Role updated",                desc: "Emma Thompson promoted to Seller",           time: "3 hr ago",   read: true  },
    { id: 5, icon: ShieldAlert, iconColor: "text-red-500",    iconBg: "bg-red-50",    title: "Account suspended",           desc: "Priya Krishnan's account was suspended",     time: "Yesterday",  read: true  },
];

export default function UserManagement() {
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<Role | "All">("All");
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editRole, setEditRole] = useState<Role>("Tourist");
    const [customPerms, setCustomPerms] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", role: "Seller" as Role });

    // Notifications
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    // Fetch real users
    useEffect(() => {
        fetch("/api/admin/users")
            .then(r => r.json())
            .then((data: Array<{ id: string; full_name: string | null; email: string; role: string; is_active: boolean; created_at: string }>) => {
                if (!Array.isArray(data)) return;
                setUsers(data.map(u => ({
                    id: u.id,
                    name: u.full_name ?? u.email,
                    email: u.email,
                    joined: formatJoinDate(u.created_at),
                    role: toDisplayRole(u.role),
                    status: u.is_active ? "Active" : "Suspended",
                    avatar: (u.full_name ?? u.email).split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
                })));
            })
            .finally(() => setLoadingUsers(false));
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const dismissNotif = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

    const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
        // Optimistic UI update
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
        if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, ...updates } : prev);

        // Persist to DB
        const dbUpdates: Record<string, unknown> = {};
        if (updates.role !== undefined) dbUpdates.role = toDbRole(updates.role);
        if (updates.status !== undefined) dbUpdates.is_active = updates.status === "Active";

        await fetch(`/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dbUpdates),
        });

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to revoke access for this user? This action cannot be undone.")) return;
        await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
        setUsers(prev => prev.filter(u => u.id !== userId));
        setSelectedUser(null);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        // Creating users requires Supabase service role — not available here.
        // Direct users to sign up or create via Supabase Dashboard.
        alert("To add users, ask them to sign up at /signup, or create them via the Supabase Dashboard > Authentication > Users.");
        setIsAddModalOpen(false);
        setNewUserForm({ name: "", email: "", password: "", role: "Seller" as Role });
    };

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

            <AdminSidebar activePage="User Management" />

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">User Management & Access Control</h1>
                        <p className="text-xs text-slate-400">Role-based permissions · {users.length} system users</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#ff6b35] text-white text-xs font-semibold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add User</span>
                        </button>

                        {/* ── Notification Bell ── */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(o => !o)}
                                className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                <Bell className="w-4 h-4 text-slate-500" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#ff6b35] text-white text-[9px] font-bold rounded-full px-1 shadow-sm">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown panel */}
                            {notifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                    {/* Panel header */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                                        <div className="flex items-center space-x-2">
                                            <Bell className="w-3.5 h-3.5 text-[#ff6b35]" />
                                            <span className="text-sm font-bold text-slate-900">Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-bold bg-[#ff6b35] text-white px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="flex items-center space-x-1 text-[10px] font-semibold text-slate-400 hover:text-[#ff6b35] transition-colors"
                                            >
                                                <CheckCheck className="w-3 h-3" />
                                                <span>Mark all read</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Notification list */}
                                    <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-50">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                                                <Bell className="w-8 h-8 mb-2" />
                                                <p className="text-xs font-medium">No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map(n => {
                                                const Icon = n.icon;
                                                return (
                                                    <div
                                                        key={n.id}
                                                        className={`flex items-start space-x-3 px-4 py-3 transition-colors group ${
                                                            n.read ? "bg-white" : "bg-orange-50/40"
                                                        }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                            <Icon className={`w-4 h-4 ${n.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <p className={`text-xs font-semibold truncate ${ n.read ? "text-slate-600" : "text-slate-900" }`}>{n.title}</p>
                                                                <button
                                                                    onClick={() => dismissNotif(n.id)}
                                                                    className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100 transition-all"
                                                                >
                                                                    <X className="w-3 h-3 text-slate-400" />
                                                                </button>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{n.desc}</p>
                                                            <p className="text-[10px] text-slate-300 mt-1">{n.time}</p>
                                                        </div>
                                                        {!n.read && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                                        <button className="w-full text-[11px] font-semibold text-slate-400 hover:text-[#ff6b35] transition-colors py-1">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                                            {loadingUsers && (
                                                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">Loading users…</td></tr>
                                            )}
                                            {!loadingUsers && filtered.length === 0 && (
                                                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">No users found.</td></tr>
                                            )}
                                            {!loadingUsers && filtered.map(u => (
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
                                                            className={`relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ml-2 outline-none ${hardLocked
                                                                    ? "bg-slate-200 cursor-not-allowed"
                                                                    : isOn
                                                                        ? "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                                                                        : "bg-slate-200 hover:bg-slate-300 cursor-pointer"
                                                                }`}
                                                        >
                                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isOn ? "translate-x-4" : "translate-x-0"
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
                                        onClick={() => handleUpdateUser(selectedUser.id, { role: editRole })}
                                        className="w-full py-2.5 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#e55a2b] transition-colors shadow-sm shadow-orange-200 flex items-center justify-center space-x-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save Role</span>
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleUpdateUser(selectedUser.id, { status: selectedUser.status === "Active" ? "Suspended" : "Active" })}
                                    className={`w-full py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center space-x-2 ${
                                        selectedUser.status === "Active" 
                                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" 
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    }`}
                                >
                                    <PauseCircle className="w-3.5 h-3.5" />
                                    <span>{selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}</span>
                                </button>
                                <button 
                                    onClick={() => handleDeleteUser(selectedUser.id)}
                                    className="w-full py-2 rounded-xl bg-slate-50 text-red-500 text-xs font-semibold border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Revoke Access</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Create a new core platform account</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCircle2 className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Maya Silva"
                                        value={newUserForm.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-4 h-4 text-slate-400 text-xs font-bold leading-none flex items-center justify-center">@</div>
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        placeholder="e.g. maya@ceygo.lk"
                                        value={newUserForm.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Initial Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input
                                        required
                                        type="password"
                                        placeholder="Min 6 characters"
                                        value={newUserForm.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">System Role</label>
                                <div className="relative">
                                    <select
                                        value={newUserForm.role}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewUserForm({ ...newUserForm, role: e.target.value as Role })}
                                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Admin">Administrator (Full Access)</option>
                                        <option value="Seller">Seller / Partner</option>
                                        <option value="Tourist">Tourist / Consumer</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 flex items-center space-x-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-semibold text-sm shadow-sm shadow-orange-200 transition-colors flex items-center justify-center space-x-2">
                                    <Plus className="w-4 h-4" />
                                    <span>Create User</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}