// beta/orgs/[orgId]/petitions/[petitionId]/route.ts
import BackendApiClient from 'core/api/client/BackendApiClient';
import { PetitionModel } from 'features/petition/utils/models';
import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import {
  ZetkinCampaign,
  ZetkinOrganization,
  ZetkinPetition,
} from 'utils/types/zetkin';

interface RouteMeta {
  params: {
    orgId: string;
    campId: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  const campaign = await apiClient.get<ZetkinCampaign>(
    `/api/orgs/${params.orgId}/campaigns/${params.campId}`
  );

  const body = await request.json();

  const petitionDocs = await PetitionModel.find({
    orgId: org.id,
  });

  const id = petitionDocs.length + 1;

  const created = await PetitionModel.create({
    orgId: org.id,
    campId: campaign.id,
    created_at: new Date().toISOString(),
    id,
    content: '',
    ...body,
  });

  const zetkinPetition: ZetkinPetition = {
    id,
    title: created.title ?? '',
    description: created.info_text ?? '',
    organization: {
      id: org.id,
      title: org.title,
    },
    project: {
      id: campaign.id,
      title: campaign.title,
    },
    created_at: created.created_at,
    content: '',
  };

  return NextResponse.json({ data: zetkinPetition }, { status: 201 });
}
