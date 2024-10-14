import { IncomingHttpHeaders } from 'http';
import { NextResponse } from 'next/server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinMembership } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';

type GuardedFnProps = {
  apiClient: BackendApiClient;
  orgId: number;
  role: string | null;
};

type GuardedFn = (props: GuardedFnProps) => Promise<Response>;

type AuthParams = {
  orgId: number | string;
  request: Request;
  roles?: string[];
};

export default async function asOrgAuthorized(
  params: AuthParams,
  fn: GuardedFn
): Promise<Response> {
  const { request, orgId, roles } = params;
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  try {
    const membership = await apiClient.get<ZetkinMembership>(
      `/api/users/me/memberships/${orgId}`
    );

    if (roles) {
      const role = membership.role;
      if (!role || !roles.includes(role)) {
        return new NextResponse(null, { status: 403 });
      }
    }

    return fn({
      apiClient: apiClient,
      orgId: membership.organization.id,
      role: membership.role,
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return new NextResponse(null, { status: err.status });
    } else {
      return new NextResponse(null, { status: 500 });
    }
  }
}
