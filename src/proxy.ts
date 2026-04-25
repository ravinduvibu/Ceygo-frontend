import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type Role = "traveler" | "partner" | "admin";

// Which roles may access each route prefix
const PROTECTED: [string, Role[]][] = [
  ["/admin", ["admin"]],
  ["/usermanagement", ["admin"]],
  ["/verification", ["admin"]],
  ["/forecasting", ["admin"]],
  ["/settings/admin", ["admin"]],
  ["/verified-reviews/admin", ["admin"]],
  ["/partnerdashboard", ["partner"]],
  ["/settings/partner", ["partner"]],
  ["/dashboard", ["traveler"]],
  ["/wishlist", ["traveler"]],
  ["/bookings", ["traveler"]],
  ["/settings/traveler", ["traveler"]],
  ["/verified-reviews/traveler", ["traveler"]],
  ["/leave-a-review", ["traveler"]],
  ["/messages", ["traveler", "partner"]],
  ["/onboarding", ["partner"]],
];

const ROLE_HOME: Record<Role, string> = {
  traveler: "/dashboard",
  partner: "/partnerdashboard",
  admin: "/admin",
};

function requiredRoles(path: string): Role[] | null {
  for (const [prefix, roles] of PROTECTED) {
    if (path === prefix || path.startsWith(prefix + "/")) return roles;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const path = request.nextUrl.pathname;
  const needed = requiredRoles(path);

  // Public route — no protection needed
  if (!needed) return supabaseResponse;

  const { data: { user } } = await supabase.auth.getUser();

  // Not authenticated
  if (!user) {
    const to = path.startsWith("/admin") ? "/admin-loging" : "/signin";
    return NextResponse.redirect(new URL(to, request.url));
  }

  // Get role — prefer the cookie (fast), fall back to DB (first load after cookie loss)
  let role = request.cookies.get("ceygo_role")?.value as Role | undefined;

  if (!role) {
    const { data: p } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = p?.role as Role | undefined;
    if (role) supabaseResponse.cookies.set("ceygo_role", role, { path: "/", maxAge: 86400, sameSite: "lax", httpOnly: true });
  }

  if (!role || !needed.includes(role)) {
    const home = role ? ROLE_HOME[role] : "/signin";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/usermanagement/:path*",
    "/verification/:path*",
    "/forecasting/:path*",
    "/settings/:path*",
    "/partnerdashboard/:path*",
    "/dashboard/:path*",
    "/wishlist/:path*",
    "/bookings/:path*",
    "/messages/:path*",
    "/onboarding/:path*",
    "/verified-reviews/traveler/:path*",
    "/verified-reviews/admin/:path*",
    "/leave-a-review/:path*",
  ],
};
