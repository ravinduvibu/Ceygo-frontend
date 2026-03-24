import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the 'auth' cookie exists
  const auth = request.cookies.get('auth');
  
  // If no auth cookie, redirect /admin routes to the login page (/)
  if (!auth && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Ensure the middleware only applies to /admin and its subroutes
export const config = {
  matcher: ['/admin/:path*'],
};
