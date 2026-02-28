import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import requiredEnvVar from 'utils/requiredEnvVar';
import { stringToBool } from 'utils/stringUtils';
import { AppSession } from 'utils/types';

type Context = {
  params: {
    path: string[];
  };
};

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;

async function proxy(
  request: NextRequest,
  context: Context
): Promise<NextResponse> {
  const clientId = requiredEnvVar('ZETKIN_CLIENT_ID');
  const clientSecret = requiredEnvVar('ZETKIN_CLIENT_SECRET');
  const host = requiredEnvVar('ZETKIN_API_HOST');
  const port = process.env.ZETKIN_API_PORT;
  const ssl = stringToBool(process.env.ZETKIN_USE_TLS);

  const path = context.params.path;
  const pathStr = path.join('/');

  const protocol = ssl ? 'https' : 'http';
  const hostAndPort = host + (port ? `:${port}` : '');
  const apiBase = `${protocol}://${hostAndPort}/v2/`;

  const cookieStore = await cookies();

  const session = await getIronSession<AppSession>(cookieStore, {
    cookieName: 'zsid',
    password: requiredEnvVar('SESSION_PASSWORD'),
  });

  const headers: Headers = new Headers();

  const requestOptions: RequestInit = {
    headers: headers,
    method: request.method,
  };

  const requestContentType = request.headers.get('Content-Type');
  if (requestContentType == 'application/json') {
    requestOptions.body = await request.text();

    if (requestContentType) {
      headers.set('Content-Type', requestContentType);
    }
  }

  async function makeZetkinApiRequest() {
    headers.set('Authorization', 'Bearer ' + session.tokenData?.access_token);

    let url = apiBase + pathStr;
    if (request.nextUrl.searchParams.size) {
      url += '?' + request.nextUrl.searchParams.toString();
    }

    return fetch(url, requestOptions);
  }

  let zetkinResponse: Response = await makeZetkinApiRequest();

  if (zetkinResponse.status == 401) {
    const errorPayload = await zetkinResponse.json();
    if (errorPayload.error?.includes('invalid_token')) {
      if (session.tokenData?.refresh_token) {
        const refreshData = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: session.tokenData?.refresh_token,
        });
        const tokenUrl = apiBase + 'oauth/token';

        const refreshResponse = await fetch(tokenUrl, {
          body: refreshData,
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          },
          method: 'POST',
        });

        const payload = await refreshResponse.json();

        session.tokenData = payload;
        await session.save();

        zetkinResponse = await makeZetkinApiRequest();
      }
    }
  }

  if (zetkinResponse.status == 204) {
    return new NextResponse(null, { status: 204 });
  } else {
    const zetkinPayload = await zetkinResponse.json();

    return NextResponse.json(zetkinPayload, { status: zetkinResponse.status });
  }
}
