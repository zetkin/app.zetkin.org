import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

import { routing } from 'i18n/routing';
import requiredEnvVar from 'utils/requiredEnvVar';
import { AppSession } from 'utils/types';

const protectedRoutes = ['/my', '/call'];

// Pages Router routes: skip next-intl rewriting for these.
const pagesRouterRoutes = ['/', '/organize', '/login', '/logout', '/legacy'];

const intlMiddleware = createIntlMiddleware(routing);

function matchesRoute(path: string, route: string) {
  return path == route || path.startsWith(`${route}/`);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Auth check for protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    matchesRoute(path, route)
  );

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

  // Skip next-intl rewriting for Pages Router routes
  const isPagesRoute = pagesRouterRoutes.some((route) =>
    matchesRoute(path, route)
  );

  if (isPagesRoute) {
    const headers = new Headers(request.headers);
    headers.set('x-requested-path', path);
    return NextResponse.next({ request: { headers } });
  }

  // Run next-intl middleware for App Router routes
  const response = intlMiddleware(request);
  response.headers.set('x-requested-path', path);

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|locale).*)',
};
