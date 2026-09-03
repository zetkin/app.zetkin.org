import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import {
  Zetkin2Household,
  HouseholdColor,
  HouseholdWithColor,
} from 'features/canvass/types';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { HouseholdColorModel } from 'features/areaAssignments/models';

type RouteMeta = {
  params: Promise<{
    locationId: string;
    orgId: string;
  }>;
};

export async function GET(request: NextRequest, props: RouteMeta) {
  const params = await props.params;
  await mongoose.connect(process.env.MONGODB_URL || '');
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const households = await apiClient.get<Zetkin2Household[]>(
    `/api2/orgs/${params.orgId}/locations/${
      params.locationId
    }/households?${request.nextUrl.searchParams.toString()}`
  );

  const householdsWithColor: HouseholdWithColor[] = [];
  for (const household of households) {
    const householdColorModel = await HouseholdColorModel.findOne({
      householdId: household.id,
    });

    const householdWithColor: HouseholdWithColor = {
      ...household,
      color: (householdColorModel?.color ?? 'clear') as HouseholdColor,
    };
    householdsWithColor.push(householdWithColor);
  }

  return NextResponse.json({ data: householdsWithColor });
}
