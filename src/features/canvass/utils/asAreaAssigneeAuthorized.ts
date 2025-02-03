import mongoose from 'mongoose';
import { IncomingHttpHeaders } from 'http';
import { NextResponse } from 'next/server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinMembership } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';
import { AreaAssignmentModel } from '../../areaAssignments/models';

type GuardedFnProps = {
  apiClient: BackendApiClient;
  orgId: number;
  personId: number;
  role: string | null;
};

type GuardedFn = (props: GuardedFnProps) => Promise<Response>;

type AuthParams = {
  orgId: number | string;
  request: Request;
};

export default async function asAreaAssigneeAuthorized(
  params: AuthParams,
  fn: GuardedFn
): Promise<Response> {
  const { request, orgId } = params;
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  try {
    const membership = await apiClient.get<ZetkinMembership>(
      `/api/users/me/memberships/${orgId}`
    );

    if (!membership.role) {
      await mongoose.connect(process.env.MONGODB_URL || '');
      const assignmentModels = await AreaAssignmentModel.find({
        orgId: membership.organization.id,
        'sessions.personId': { $eq: membership.profile.id },
      });

      if (!assignmentModels.length) {
        return NextResponse.json(
          { error: { title: 'Must be areaAssignee' } },
          { status: 403 }
        );
      }
    }

    return fn({
      apiClient: apiClient,
      orgId: membership.organization.id,
      personId: membership.profile.id,
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
