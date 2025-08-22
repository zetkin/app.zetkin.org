import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { APIHousehold, Zetkin2Household } from 'features/canvass/types';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { HouseholdColorModel } from 'features/areaAssignments/models';

type RouteMeta = {
  params: {
    locationId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const households = await apiClient.get<APIHousehold[]>(
    `/api2/orgs/${params.orgId}/locations/${params.locationId}/households`
  );

  const householdsWithColor: Zetkin2Household[] = [];
  for (const household of households) {
    const householdColorModel = await HouseholdColorModel.findOne({
      householdId: household.id,
    });

    const householdWithColor: Zetkin2Household = {
      ...household,
      color: householdColorModel?.color ?? null,
    };
    householdsWithColor.push(householdWithColor);
  }

  return NextResponse.json({ data: householdsWithColor });
}
