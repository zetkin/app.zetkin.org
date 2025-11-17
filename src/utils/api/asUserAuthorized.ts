import { NextResponse } from 'next/server';
import { IncomingHttpHeaders } from 'http';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinPerson } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';

type GuardedFnProps = {
  apiClient: BackendApiClient;
  userId: number;
};

type GuardedFn = (props: GuardedFnProps) => Promise<Response>;

type AuthParams = {
  request: Request;
  roles?: string[];
};

export default async function asUserAuthorized(
  params: AuthParams,
  fn: GuardedFn
): Promise<Response> {
  const { request } = params;
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  try {
    const user = await apiClient.get<ZetkinPerson>('/api/users/me');

    return fn({
      apiClient: apiClient,
      userId: user.id,
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return new NextResponse(null, { status: err.status });
    } else {
      return new NextResponse(null, { status: 500 });
    }
  }
}
