import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
  '/forgot-password'
];

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken');
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!authToken && !isPublicPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (authToken && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};