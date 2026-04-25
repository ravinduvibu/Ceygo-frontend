import { NextResponse, type NextRequest } from "next/server";

const VALID_ROLES = ["traveler", "partner", "admin"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function POST(request: NextRequest) {
  const { role } = await request.json() as { role: string };

  if (!VALID_ROLES.includes(role as Role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("ceygo_role", role, {
    path: "/",
    maxAge: 86400,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("ceygo_role", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });
  return response;
}
