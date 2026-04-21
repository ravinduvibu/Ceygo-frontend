import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const hasSession = req.cookies.get('auth')?.value === 'true'

  // Protect Admin Routes
  const isAdminRoute = req.nextUrl.pathname === '/admin' || req.nextUrl.pathname.startsWith('/admin/')
  if (isAdminRoute && !hasSession) {
    return NextResponse.redirect(new URL('/admin-loging', req.url))
  }

  // Protect Partner Dashboard
  if (req.nextUrl.pathname.startsWith('/partnerdashboard') && !hasSession) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/partnerdashboard/:path*'],
}
