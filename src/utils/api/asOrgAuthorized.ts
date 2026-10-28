import { IncomingHttpHeaders } from 'http';
import { NextResponse } from 'next/server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinMembership, ZetkinUser } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';
import IApiClient from 'core/api/client/IApiClient';

export type GuardedFnProps = {
  apiClient: IApiClient;
  orgId: number;
  role: string | null;
};

type GuardedFn = (props: GuardedFnProps) => Promise<Response>;

export type AuthParams = {
  orgId: number | string;
  request: Request;
  roles?: string[];
};

export default async function asOrgAuthorized(
  params: AuthParams,
  fn: GuardedFn,
  apiClient?: IApiClient
): Promise<Response> {
  const { request, orgId, roles } = params;
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  apiClient = apiClient ?? new BackendApiClient(headers);

  try {
    const [user, membership] = await Promise.all([
      apiClient.get<ZetkinUser>(`/api/users/me`),
      apiClient
        .get<ZetkinMembership>(`/api/users/me/memberships/${orgId}`)
        .catch((err) => {
          if (err instanceof ApiClientError && err.status === 404) {
            return null;
          }
          throw err;
        }),
    ]);

    if (!membership && !user.is_superuser) {
      return new NextResponse(null, { status: 403 });
    }

    let hasCorrectRole = false;
    if (!roles) {
      hasCorrectRole = true;
    } else if (
      membership &&
      membership.role &&
      roles.includes(membership.role)
    ) {
      hasCorrectRole = true;
    }

    let role = membership ? membership.role : null;
    let membershipOrgId = membership ? membership.organization.id : null;

    if (user.is_superuser && !hasCorrectRole) {
      role = !roles || roles.includes('admin') ? 'admin' : roles[0];
      membershipOrgId = +orgId;
      hasCorrectRole = true;
    }

    if (role === null || membershipOrgId === null) {
      return new NextResponse(null, { status: 403 });
    }

    if (!hasCorrectRole) {
      return new NextResponse(null, { status: 403 });
    }

    return fn({
      apiClient: apiClient,
      orgId: membershipOrgId,
      role: role,
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return new NextResponse(null, { status: err.status });
    } else {
      return new NextResponse(null, { status: 500 });
    }
  }
}
