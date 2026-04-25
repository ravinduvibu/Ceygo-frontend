import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { gig_id, guests = 1, booking_date, note } = body;

    if (!gig_id) return NextResponse.json({ error: "gig_id required" }, { status: 400 });

    const { data: gig, error: gigError } = await supabase
        .from("gigs")
        .select("id, price, partner_id, is_active")
        .eq("id", gig_id)
        .eq("is_active", true)
        .single();

    if (gigError || !gig) {
        return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    const amount = Number(gig.price) * Number(guests);
    const notes = JSON.stringify({ booking_date: booking_date || null, guests: Number(guests), note: note || "" });

    const { data: order, error } = await supabase
        .from("orders")
        .insert({
            traveler_id: user.id,
            gig_id,
            partner_id: gig.partner_id,
            status: "pending",
            amount,
            notes,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(order, { status: 201 });
}
