import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Subdomínio do App (meuapp.listmeapp.com.br ou app.listmeapp.com.br)
  if (host.startsWith('meuapp.') || host.startsWith('app.')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/app', request.url));
    }
  }

  // 2. Subdomínio do Admin (admin.listmeapp.com.br)
  if (host.startsWith('admin.')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
