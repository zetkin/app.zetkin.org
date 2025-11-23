// beta/orgs/[orgId]/petitions/[petitionId]/route.ts
import { PetitionModel } from 'features/petition/utils/models';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { ZetkinPetition } from 'utils/types/zetkin';

interface RouteMeta {
  params: {
    orgId: string;
    campId: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const body = await request.json();

  // TODO
  // find petition Id for new petitiion
  const id = 1;

  const created = await PetitionModel.create({
    orgId: Number(params.orgId),
    campId: Number(params.campId),
    created_at: new Date().getDate.toString(),
    id,
    ...body,
  });

  // TODO Fetch org camp data from real API

  const zetkinPetition: ZetkinPetition = {
    id: 1,
    title: 'string',
    description: 'string',
    signature: 'optional_signature',
    organization: {
      id: 1,
      title: '',
    },
    project: {
      id: 345,
      title: 'string',
    },
    created_at: 'string',
  };

  return NextResponse.json({ data: zetkinPetition }, { status: 201 });
}
