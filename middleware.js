import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // With Firebase Auth, authentication is handled client-side
  // This middleware is simplified - Firebase handles auth state
  // For server-side protection, you would use Firebase Admin SDK

  // Allow all requests to pass through
  // Client-side AuthContext will handle redirects for protected routes
  return NextResponse.next();
}

// Define which paths this middleware applies to
export const config = {
  matcher: [
    // Skip static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
