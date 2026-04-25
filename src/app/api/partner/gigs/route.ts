import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("gigs")
        .select("id, title, price, category, location, image_url, rating, reviews_count, orders_count, is_active, impressions, clicks, created_at")
        .eq("partner_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, price, category, location, description, image_url } = body;

    if (!title || price === undefined) {
        return NextResponse.json({ error: "title and price are required" }, { status: 400 });
    }

    const numericPrice = parseFloat(String(price).replace(/,/g, ""));
    if (isNaN(numericPrice)) {
        return NextResponse.json({ error: "price must be a number" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("gigs")
        .insert({
            partner_id: user.id,
            title,
            price: numericPrice,
            category: category ?? null,
            location: location ?? null,
            description: description ?? null,
            image_url: image_url ?? null,
            is_active: false,
        })
        .select("id, title, price, category, location, image_url, rating, reviews_count, orders_count, is_active, created_at")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
