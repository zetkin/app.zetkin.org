import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { IncomingHttpHeaders } from 'http';

import {
  APIHousehold,
  HouseholdPatchBody,
  Zetkin2Household,
} from 'features/canvass/types';
import { HouseholdColorModel } from 'features/areaAssignments/models';
import BackendApiClient from 'core/api/client/BackendApiClient';

type RouteMeta = {
  params: {
    householdId: string;
    locationId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const household = await apiClient.get<APIHousehold>(
    `/api2/orgs/${params.orgId}/locations/${params.locationId}/households/${params.householdId}`
  );

  const householdColorModel = await HouseholdColorModel.findOne({
    householdId: params.householdId,
  });

  const householdWithColor: Zetkin2Household = {
    ...household,
    color: householdColorModel?.color ?? 'clear',
  };

  return NextResponse.json({ data: householdWithColor });
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const payload = await request.json();
  const { color, ...zetkinPayload } = payload;

  if (color) {
    await HouseholdColorModel.findOneAndUpdate(
      { householdId: params.householdId },
      {
        color: payload.color,
      },
      { new: true, upsert: true }
    );
  }

  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const household =
    Object.keys(zetkinPayload).length > 0
      ? await apiClient.patch<APIHousehold, HouseholdPatchBody>(
          `/api2/orgs/${params.orgId}/locations/${params.locationId}/households/${params.householdId}`,
          zetkinPayload
        )
      : await apiClient.get<APIHousehold>(
          `/api2/orgs/${params.orgId}/locations/${params.locationId}/households/${params.householdId}`
        );

  const householdWithColor: Zetkin2Household = {
    ...household,
    color: color ?? null,
  };

  return NextResponse.json({
    data: householdWithColor,
  });
}
