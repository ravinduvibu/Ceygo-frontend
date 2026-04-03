import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // 1. Initialize Supabase manually in the middleware
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 2. Refresh the session (This makes sure the user is still valid)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // --- MANUAL SESSION FIX ---
  // If we don't have a session via the standard method, check the manual cookie
  const manualToken = req.cookies.get('sb-access-token')
  const hasSession = !!session || !!manualToken
  // -------------------------

  // 3. Protect Admin Routes
  const isAdminRoute = req.nextUrl.pathname === '/admin' || req.nextUrl.pathname.startsWith('/admin/');
  if (isAdminRoute) {
    if (!hasSession) {
      // Not logged in? Kick them to the admin login page
      return NextResponse.redirect(new URL('/admin-loging', req.url))
    }
  }

  // 4. Protect Partner Dashboard
  if (req.nextUrl.pathname.startsWith('/partnerdashboard')) {
    if (!hasSession) {
      // Not logged in? Kick them to the partner login page
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}

// 5. Specify which paths to protect
export const config = {
  matcher: ['/admin/:path*', '/partnerdashboard/:path*'],
}
