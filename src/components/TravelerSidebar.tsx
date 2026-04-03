"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
    LayoutDashboard,
    Bookmark,
    MessageSquare,
    Compass,
    Star,
    BookOpen,
    Settings,
    ChevronRight,
    LogOut,
    Heart,
} from "lucide-react";

interface SidebarProps {
    activePage: string;
    wishlistCount?: number;
}

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", count: 0, href: "/dashboard" },
    { icon: Bookmark, label: "My Verified Journeys", count: 0, href: "/dashboard/My-Verified-Journeys" },
    { icon: MessageSquare, label: "Message Artisan", count: 0, href: "/messages" },
    { icon: Compass, label: "Find Experiences", count: 0, href: "/search" },
    { icon: Heart, label: "Wishlist", count: 0, href: "/wishlist" },
    { icon: Star, label: "Verified Reviews", count: 0, href: "/verified-reviews/traveler" },
    { icon: BookOpen, label: "Platform Guide", count: 0, href: "/guide" },
    { icon: Settings, label: "Settings", count: 0, href: "/settings/traveler" },
];

const CLEARED_KEY = "ceygo_nav_cleared";

function getClearedLabels(): string[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(CLEARED_KEY) || "[]"); } catch { return []; }
}
function clearNavLabel(label: string) {
    const cleared = getClearedLabels();
    if (!cleared.includes(label)) {
        localStorage.setItem(CLEARED_KEY, JSON.stringify([...cleared, label]));
    }
}

export default function TravelerSidebar({ activePage, wishlistCount = 0 }: SidebarProps) {
    const router = useRouter();
    const [clearedLabels, setClearedLabels] = useState<string[]>([]);
    
    // Auth & Dynamic Notification State
    const [fullName, setFullName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [activeJourneys, setActiveJourneys] = useState(0);
    const [wishlistItems, setWishlistItems] = useState(0);

    useEffect(() => {
        clearNavLabel(activePage);
        setClearedLabels(getClearedLabels());

        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase
                    .from('users')
                    .select('full_name, avatar_base64')
                    .eq('id', session.user.id)
                    .single();
                    
                if (data) {
                    setFullName(data.full_name || "");
                    setAvatar(data.avatar_base64 || "");
                }

                // Fetch Unread Messages Count
                const { count: msgCount } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('receiver_id', session.user.id)
                    .eq('is_read', false);
                setUnreadMessages(msgCount || 0);

                // Fetch Active Journeys Count
                const { count: orderCount } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('traveler_id', session.user.id)
                    .in('status', ['Pending', 'Confirmed']);
                setActiveJourneys(orderCount || 0);

                // Fetch Wishlist Items Count
                const { count: wishCount } = await supabase
                    .from('wishlists')
                    .select('*', { count: 'exact', head: true })
                    .eq('traveler_id', session.user.id);
                setWishlistItems(wishCount || 0);
            }
            setLoading(false);
        }
        loadProfile();
    }, [activePage]);

    const clearAllNavLabels = () => {
        const allLabels = navItems.map(item => item.label);
        localStorage.setItem(CLEARED_KEY, JSON.stringify(allLabels));
        setClearedLabels(allLabels);
    };

    const handleNavClick = (label: string) => {
        // As requested: viewing a tab clears all previous notifications
        clearAllNavLabels();
    };

    const initials = fullName ? fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "AA";

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-sm z-10">
            <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                <div className="relative h-9 w-28">
                    <Image src="/images/logo_transparent.png" alt="Ceygo" fill className="object-contain" priority />
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map(({ icon: Icon, label, count, href }) => {
                    const active = label === activePage;
                    
                    // Assign Dynamic Counts
                    let rawCount = count;
                    if (label === "Wishlist") rawCount = wishlistItems;
                    if (label === "My Verified Journeys") rawCount = activeJourneys;
                    if (label === "Message Artisan") rawCount = unreadMessages;

                    const displayCount = clearedLabels.includes(label) ? 0 : rawCount;
                    return (
                        <Link
                            key={label}
                            href={href}
                            onMouseEnter={() => {
                                clearNavLabel(label);
                                setClearedLabels(getClearedLabels());
                            }}
                            onClick={() => handleNavClick(label)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                    ? "bg-orange-50 text-[#ff6b35] border border-orange-100 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={`w-4 h-4 ${active ? "text-[#ff6b35]" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span>{label}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {displayCount > 0 && (
                                    <span className="text-xs font-bold bg-[#ff6b35]/10 text-[#ff6b35] px-1.5 py-0.5 rounded-full">{displayCount}</span>
                                )}
                                {active && <ChevronRight className="w-3.5 h-3.5 text-[#ff6b35]" />}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center space-x-3 px-2 py-2 rounded-xl group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden relative shadow-sm ${!avatar ? "bg-gradient-to-br from-[#ff6b35] to-[#0ea5e9]" : ""}`}>
                        {avatar 
                            ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            : <span>{initials}</span>
                        }
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{loading ? "Loading..." : (fullName || "New User")}</p>
                        <p className="text-xs text-slate-400 truncate">Traveler · Verified</p>
                    </div>
                    <button 
                        onClick={async () => { 
                            await supabase.auth.signOut();
                            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
                            router.push('/');
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-auto"
                        title="Log out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
