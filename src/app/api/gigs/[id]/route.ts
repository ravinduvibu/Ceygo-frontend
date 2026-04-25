import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("gigs")
        .select(`
            id, title, description, price, category, location, image_url,
            rating, reviews_count, orders_count, is_active, created_at,
            profiles!partner_id ( id, full_name, avatar_url, created_at )
        `)
        .eq("id", id)
        .eq("is_active", true)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
