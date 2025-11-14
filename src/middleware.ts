import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

import requiredEnvVar from 'utils/requiredEnvVar';
import { AppSession } from 'utils/types';

const protectedRoutes = ['/my'];

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-requested-path', request.nextUrl.pathname);

  const path = request.nextUrl.pathname;
  const isProtectedRoute = !!protectedRoutes.find((route) => {
    return path.startsWith(route);
  });

  const cookieStore = cookies();

  const session = await getIronSession<AppSession>(cookieStore, {
    cookieName: 'zsid',
    password: requiredEnvVar('SESSION_PASSWORD'),
  });

  const hasTokenData = !!session?.tokenData;
  const userIsAnonymous = !hasTokenData;

  if (isProtectedRoute && userIsAnonymous) {
    return NextResponse.redirect(
      new URL('/login?redirect=' + path, request.nextUrl)
    );
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
