import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const ROLE_HOME: Record<string, string> = {
  traveler: "/dashboard",
  partner: "/partnerdashboard",
  admin: "/admin",
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    return NextResponse.redirect(`${origin}/signin?error=auth_callback_failed`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  let role = (profile?.role ?? "traveler") as string;

  // For new Google users the trigger defaults role to 'traveler'.
  // If signup page passed role=partner and this is a brand-new account, fix it.
  const urlRole = searchParams.get("role");
  const isNewAccount =
    Date.now() - new Date(session.user.created_at).getTime() < 60_000;

  if (isNewAccount && urlRole === "partner" && role === "traveler") {
    await supabase
      .from("profiles")
      .update({ role: "partner" })
      .eq("id", session.user.id);
    role = "partner";
  }

  const redirect = ROLE_HOME[role] ?? "/dashboard";

  const response = NextResponse.redirect(`${origin}${redirect}`);
  response.cookies.set("ceygo_role", role, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
