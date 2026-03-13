import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminAuth = request.cookies.get('admin_auth')?.value === 'true';

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!adminAuth) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Prevent logged-in admin from seeing login page
  if (pathname === '/login' && adminAuth) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};


