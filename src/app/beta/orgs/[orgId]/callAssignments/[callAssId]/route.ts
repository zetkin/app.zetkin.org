import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { IncomingHttpHeaders } from 'http';

import { DialingModeModel } from 'features/callAssignments/models';
import { DialingMode } from 'features/callAssignments/betaTypes';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    callAssId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const [assignment, dialingModeModel] = await Promise.all([
    apiClient.get<ZetkinCallAssignment>(
      `/api/orgs/${params.orgId}/call_assignments/${params.callAssId}`
    ),
    DialingModeModel.findOne({ callAssId: params.callAssId }),
  ]);

  return NextResponse.json({
    data: {
      ...assignment,
      dialing_mode: (dialingModeModel?.mode ?? 'manual') as DialingMode,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const payload = await request.json();

  await DialingModeModel.findOneAndUpdate(
    { callAssId: params.callAssId },
    {
      mode: payload.dialing_mode,
    },
    { new: true, upsert: true }
  );
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const assignment = await apiClient.get<ZetkinCallAssignment>(
    `/api/orgs/${params.orgId}/call_assignments/${params.callAssId}`
  );

  return NextResponse.json({
    data: {
      ...assignment,
      dialing_mode: payload.dialing_mode as DialingMode,
    },
  });
}
