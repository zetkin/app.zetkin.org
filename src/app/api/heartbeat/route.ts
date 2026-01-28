import { NextRequest, NextResponse } from 'next/server';
import { IncomingHttpHeaders } from 'http';

import BackendApiClient from 'core/api/client/BackendApiClient';

export async function GET(request: NextRequest) {
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  await apiClient.get('/api/session');

  return NextResponse.json({ data: null }, { status: 200 });
}
