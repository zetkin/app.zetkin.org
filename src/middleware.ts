import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

import requiredEnvVar from 'utils/requiredEnvVar';
import { AppSession } from 'utils/types';

const protectedRoutes = ['/my'];

function extractRootUrl(urlStr: string): string {
  const url = new URL(urlStr);
  return `https://${url.host}`;
}

function sanitizeUrl(urlStr: string): string {
  return new URL(urlStr).toString();
}

function setupCsp(path: string) {
  if (process.env.PLAYWRIGHT === '1') {
    return ['', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:"];
  }

  const isDev = process.env.NODE_ENV === 'development';
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  if (!process.env.MAPLIBRE_STYLE) {
    throw new Error('Unexpected undefined MAPLIBRE_STYLE.');
  }

  const mapTiler = extractRootUrl(process.env.MAPLIBRE_STYLE);
  const tileServer = extractRootUrl(
    process.env.TILESERVER || 'https://tile.openstreetmap.org'
  );

  const isEmbedJoinForm = /^\/o\/[^/]+\/embedjoinform(\/|$)/.test(path);
  const styleSrc = isEmbedJoinForm
    ? "* 'unsafe-inline'"
    : `'self' https://use.typekit.net https://p.typekit.net ${
        // TODO: switch after https://github.com/zetkin/app.zetkin.org/issues/3176 to: isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`
        "'unsafe-inline'"
      }`;
  const cspHeader = `
  default-src 'self' ${mapTiler};
  script-src 'self' 'nonce-${nonce}' 'wasm-unsafe-eval' 'strict-dynamic' ${
    isDev ? "'unsafe-eval'" : ''
  };
  style-src ${styleSrc};
  style-src-attr 'unsafe-inline';
  img-src 'self' blob: data: ${tileServer} ${
    process.env.AVATARS_URL ? `${sanitizeUrl(process.env.AVATARS_URL)} ` : ''
  } ${process.env.FILES_URL ? `${sanitizeUrl(process.env.FILES_URL)} ` : ''};
  font-src 'self' https://use.typekit.net https://p.typekit.net;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors ${isEmbedJoinForm ? '*' : "'none'"};
  upgrade-insecure-requests;
`;
  const cspHeaderTrimmed = cspHeader.replace(/\s{2,}/g, ' ').trim();

  return [nonce, cspHeaderTrimmed] as const;
}

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const path = request.nextUrl.pathname;

  const [nonce, cspHeaderTrimmed] = setupCsp(path);

  headers.set('x-nonce', nonce);

  headers.set('Content-Security-Policy', cspHeaderTrimmed);

  headers.set('x-requested-path', request.nextUrl.pathname);

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

  let response: NextResponse;

  if (isProtectedRoute && userIsAnonymous) {
    response = NextResponse.redirect(
      new URL('/login?redirect=' + path, request.nextUrl)
    );
  } else {
    response = NextResponse.next({ request: { headers } });
  }

  response.headers.set('Content-Security-Policy', cspHeaderTrimmed);

  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

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
    {
      missing: [
        { key: 'next-router-prefetch', type: 'header' },
        { key: 'purpose', type: 'header', value: 'prefetch' },
      ],
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
    },
  ],
};
