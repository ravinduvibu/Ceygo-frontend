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

    const { data, error } = await supabase
        .from("gigs")
        .select(`
            id, title, description, price, category, location, image_url,
            is_active, approval_status, created_at,
            profiles!partner_id ( id, full_name, email, created_at )
        `)
        .eq("approval_status", "pending")
        .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
}
