import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const ACTION_STATUS: Record<string, string> = {
    accept: "active",
    decline: "declined",
    complete: "completed",
    cancel: "cancelled",
};

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action } = await request.json();
    const newStatus = ACTION_STATUS[action];
    if (!newStatus) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("partner_id", user.id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
    return NextResponse.json(data);
}
