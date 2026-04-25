import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { supabase, user: null };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { supabase, user: null };
    return { supabase, user };
}

export async function GET() {
    const { supabase, user } = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
        { count: totalBookings },
        { count: verifiedSellers },
        { count: pendingVerifications },
        { count: activeTourists },
    ] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("partner_profiles").select("*", { count: "exact", head: true }).eq("approval_status", "approved"),
        supabase.from("partner_profiles").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "traveler").eq("is_active", true),
    ]);

    return NextResponse.json({
        totalBookings: totalBookings ?? 0,
        verifiedSellers: verifiedSellers ?? 0,
        pendingVerifications: pendingVerifications ?? 0,
        activeTourists: activeTourists ?? 0,
    });
}
