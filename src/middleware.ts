import { NextRequest, NextResponse } from 'next/server';
import { NextSessionService } from './features/auth/infrastructure/services/NextSessionService';

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
];

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/',
];

const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

  // Allow public API routes
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  try {
    // Get session
    const session = await NextSessionService.getSession();
    const isAuthenticated = session && await NextSessionService.isSessionValid();

    // Protected route without valid session
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Public route with valid session (redirect to dashboard)
    if (isPublicRoute && isAuthenticated && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // API routes (non-auth) need session validation
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
      if (!isAuthenticated) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            }
          },
          { status: 401 }
        );
      }

      // Add user info to headers for API routes
      const response = NextResponse.next();
      response.headers.set('x-user-id', session!.userId);
      response.headers.set('x-session-id', session!.sessionId);
      return response;
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, clear session and redirect to login if needed
    if (isProtectedRoute) {
      NextSessionService.clearSession();
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};