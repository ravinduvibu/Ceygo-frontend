import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const supabase = await createClient();

  let query = supabase
    .from("gigs")
    .select(`
      id, title, description, price, category, location, image_url,
      rating, reviews_count, orders_count, is_active, created_at,
      profiles!partner_id ( id, full_name, avatar_url )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category && category !== "All Categories") {
    query = query.eq("category", category);
  }
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
