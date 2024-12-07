import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = ['/dashboard', '/deals'];

// List of paths that are only accessible to non-authenticated users
const authPaths = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.includes(pathname) && token) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    return response;
  }

  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Comprehensive CSP for Firebase
  const cspDirectives = [
    // Default fallback
    "default-src 'self'",
    
    // Scripts - needed for Firebase and other functionality
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com https://*.googleapis.com https://*.google.com https://*.gstatic.com",
    
    // Styles
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com",
    
    // Images
    "img-src 'self' data: https: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com",
    
    // Fonts
    "font-src 'self' data: https://fonts.gstatic.com",
    
    // Connect (API endpoints, WebSocket, etc)
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://apis.google.com https://*.google.com https://*.firebase.com https://*.gstatic.com wss://*.firebaseio.com https://*.cloudfunctions.net https://identitytoolkit.googleapis.com https://*.firebaseapp.com https://securetoken.googleapis.com",
    
    // Form actions
    "form-action 'self'",
    
    // Frame sources
    "frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://*.google.com",
    
    // Media
    "media-src 'self'",
    
    // Object sources
    "object-src 'none'",
    
    // Manifest
    "manifest-src 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspDirectives);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 