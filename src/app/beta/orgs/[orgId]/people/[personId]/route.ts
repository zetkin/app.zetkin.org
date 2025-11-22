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

  const personModelDocument = await PersonModel.findOne({
    personId: params.personId,
  });
  const personModel = personModelDocument?.toObject();

  const personWithUpdates: PersonWithUpdates = {
    ...person,
    _history: {
      ...defaultData._history,
      ...personModel?._history,
      fields: {
        ...defaultData._history!.fields,
        ...personModel?._history?.fields,
      },
    },
  };

  return NextResponse.json({ data: personWithUpdates });
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const payload = await request.json();

  const now = new Date().toISOString();

  const fields = Object.keys(payload).map(
    (field) => [`_history.fields.${field}`, now] as const
  );

  const updatedDocument = await PersonModel.findOneAndUpdate(
    { personId: params.personId },
    {
      '_history.last_update': now,
      ...Object.fromEntries(fields),
    },
    { new: true, upsert: true, multi: true }
  );
  const updated = updatedDocument?.toObject();

  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const person = await apiClient.patch<ZetkinPerson>(
    `/api/orgs/${params.orgId}/people/${params.personId}`,
    payload
  );

  const personWithUpdates: PersonWithUpdates = {
    ...person,
    _history: {
      ...defaultData._history,
      ...updated?._history,
      fields: {
        ...defaultData._history!.fields,
        ...updated?._history?.fields,
      },
    },
  };

  return NextResponse.json({
    data: personWithUpdates,
  });
}

const defaultData = {
  _history: {
    created: '2025-01-01T00:00:00.000Z',
    fields: {
      id: '2025-01-01T00:00:00.000Z',
      alt_phone: '2025-01-01T00:00:00.000Z',
      email: '2025-01-01T00:00:00.000Z',
      first_name: '2025-01-01T00:00:00.000Z',
      city: '2025-01-01T00:00:00.000Z',
      last_name: '2025-01-01T00:00:00.000Z',
      co_address: '2025-01-01T00:00:00.000Z',
      country: '2025-01-01T00:00:00.000Z',
      ext_id: '2025-01-01T00:00:00.000Z',
      gender: '2025-01-01T00:00:00.000Z',
      phone: '2025-01-01T00:00:00.000Z',
      is_user: '2025-01-01T00:00:00.000Z',
      street_address: '2025-01-01T00:00:00.000Z',
      zip_code: '2025-01-01T00:00:00.000Z',
    },
    last_update: '2025-01-01T00:00:00.000Z',
  },
} as const satisfies Pick<PersonWithUpdates, '_history'> ;
