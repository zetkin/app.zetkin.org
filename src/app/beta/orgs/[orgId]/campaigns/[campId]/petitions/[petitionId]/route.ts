import BackendApiClient from 'core/api/client/BackendApiClient';
import { PetitionModel } from 'features/petition/utils/models';
import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { ZetkinCampaign, ZetkinOrganization } from 'utils/types/zetkin';
interface RouteMeta {
  params: {
    orgId: string;
    campId: string;
    petitionId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteMeta) {
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

  const petitionDoc = await PetitionModel.findOne({
    id: Number(params.petitionId),
    orgId: Number(params.orgId),
  });

  if (!petitionDoc) return;

  const res = {
    id: petitionDoc.id,
    title: petitionDoc.title ?? '',
    description: petitionDoc.info_text ?? '',
    organization: {
      id: org.id,
      title: org.title,
    },
    project: {
      id: campaign.id,
      title: campaign.title,
    },
  };

  return NextResponse.json({ data: res });
}

// export async function PATCH(request: NextRequest, { params }: RouteMeta) {
//   await mongoose.connect(process.env.MONGODB_URL || '');

//   const body = await request.json();

//   const updated = await PetitionModel.findOneAndUpdate(
//     {
//       orgId: Number(params.orgId),
//       petitionId: Number(params.petitionId),
//     },
//     body,
//     { new: true, upsert: true }
//   );

//   return NextResponse.json({ data: updated });
// }
