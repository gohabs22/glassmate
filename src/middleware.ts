import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute = pathname.startsWith('/c/') || pathname.startsWith('/guide');

  // Allow public routes through immediately (no auth required)
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if the current path is a protected route
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/qr') || pathname.startsWith('/glasses');

  // Check if the current path is an auth route
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // Check for auth session cookie (Firebase convention)
  const hasAuthCookie = request.cookies.has('__session');

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && hasAuthCookie) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
