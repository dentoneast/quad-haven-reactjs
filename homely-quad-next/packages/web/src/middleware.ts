import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/properties/:path*',
    '/leases/:path*',
    '/maintenance/:path*',
    '/payments/:path*',
    '/messages/:path*',
    '/organization/:path*',
    '/login',
    '/register',
  ],
};
