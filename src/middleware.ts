import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

import { routing } from 'i18n/routing';
import requiredEnvVar from 'utils/requiredEnvVar';
import { AppSession } from 'utils/types';

const protectedRoutes = ['/my', '/call'];

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Auth check for protected routes
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

  // Run next-intl middleware (handles locale detection and internal rewriting)
  const response = intlMiddleware(request);

  // Set requested path header for layout metadata
  response.headers.set('x-requested-path', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|locale).*)',
};
