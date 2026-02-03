import { NextRequest, NextResponse } from 'next/server';
import { IncomingHttpHeaders } from 'http';

import { ApiClientError } from 'core/api/errors';

export async function GET(request: NextRequest) {
  const requestHeaders: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (requestHeaders[key] = value));

  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const host =
    requestHeaders.host || process.env.ZETKIN_APP_HOST || 'localhost:3000';

  const serverResponse = await fetch(`${protocol}://${host}/api/session`, {
    headers: {
      cookie: requestHeaders.cookie || '',
    },
    method: 'GET',
  });

  if (!serverResponse.ok) {
    throw await ApiClientError.fromResponse(serverResponse);
  }

  const responseHeaders = new Headers();
  responseHeaders.set(
    'Set-Cookie',
    serverResponse.headers.get('Set-Cookie') || ''
  );

  return NextResponse.json(
    { data: null },
    {
      headers: responseHeaders,
      status: 200,
    }
  );
}
