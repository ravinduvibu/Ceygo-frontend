import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the 'auth' cookie exists
  const auth = request.cookies.get('auth');
  
  // If no auth cookie, redirect /admin or /partnerdashboard routes to the login page (/)
  if (!auth && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/partnerdashboard'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Ensure the middleware only applies to /admin and /partnerdashboard subroutes
export const config = {
  matcher: ['/admin/:path*', '/partnerdashboard/:path*'],
};
