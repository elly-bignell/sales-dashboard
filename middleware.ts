import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const { pathname } = request.nextUrl;

  // Allow public assets, API routes for login, and the login page itself
  if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname === '/login' ||
        pathname.includes('.') // Allow static files
      ) {
        return NextResponse.next();
  }

  // Check if user has valid authentication cookie
  const authCookie = request.cookies.get('auth-token');

  // If no auth cookie, redirect to login
  if (!authCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the token matches the environment variable (simple validation)
  const validToken = process.env.DASHBOARD_AUTH_TOKEN;
    if (authCookie.value !== validToken) {
          // Clear the invalid cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.delete('auth-token');
          return response;
    }

  return NextResponse.next();
}

export const config = {
    matcher: [
          /*
           * Match all request paths except for the ones starting with:
           * - _next/static (static files)
           * - _next/image (image optimization files)
           * - favicon.ico (favicon file)
           */
      '/((?!_next/static|_next/image|favicon.ico).*)',
        ],
};
