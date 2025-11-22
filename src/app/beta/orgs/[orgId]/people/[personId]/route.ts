import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { IncomingHttpHeaders } from 'http';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinPerson } from 'utils/types/zetkin';
import { PersonModel } from 'features/profile/models';
import { PersonWithUpdates } from 'features/profile/types/PersonWithUpdates';

type RouteMeta = {
  params: {
    orgId: string;
    personId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const person = await apiClient.get<ZetkinPerson>(
    `/api/orgs/${params.orgId}/people/${params.personId}`
  );

  const personModel = await PersonModel.findOne({
    personId: params.personId,
  });

  const personWithUpdates: PersonWithUpdates = {
    ...person,
    _history: personModel?._history,
  };

  return NextResponse.json({ data: personWithUpdates });
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const payload = await request.json();

  const now = new Date().toISOString();

  const fields = Object.keys(payload)
    .map((field) => [`_history.fields.${field}`, now] as const);

  const updated = await PersonModel.findOneAndUpdate(
    { personId: params.personId },
    {
      "_history.last_update": now,
      ...Object.fromEntries(fields),
    },
    { new: true, upsert: true, multi: true }
  );

  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const person = await apiClient.patch<ZetkinPerson>(
    `/api/orgs/${params.orgId}/people/${params.personId}`,
    payload
  );

  const personWithUpdates: PersonWithUpdates = {
    ...person,
    _history: updated?._history,
  };

  return NextResponse.json({
    data: personWithUpdates,
  });
}
