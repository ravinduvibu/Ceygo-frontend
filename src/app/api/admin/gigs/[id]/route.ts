import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { supabase, user: null };
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { supabase, user: null };
    return { supabase, user };
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { supabase, user } = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { action, admin_notes } = await request.json() as { action: "approve" | "reject"; admin_notes?: string };

    if (action === "approve") {
        const { error } = await supabase
            .from("gigs")
            .update({ is_active: true, approval_status: "approved", admin_notes: admin_notes ?? null })
            .eq("id", id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (action === "reject") {
        const { error } = await supabase
            .from("gigs")
            .update({ approval_status: "rejected", admin_notes: admin_notes ?? null })
            .eq("id", id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}
