// beta/orgs/[orgId]/petitions/[petitionId]/route.ts
import { PetitionModel } from 'features/petition/utils/models';
import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

interface RouteMeta {
  params: {
    orgId: string;
    petitionId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));

  // 2. Look up MongoDB metadata for this petition
  const petitionDoc = await PetitionModel.findOne({
    petitionId: Number(params.petitionId),
    orgId: Number(params.orgId),
  });

  return NextResponse.json({ data: petitionDoc });
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const body = await request.json();

  const created = await PetitionModel.create({
    orgId: Number(params.orgId),
    petitionId: Number(params.petitionId),
    ...body, // e.g. color, notes
  });

  return NextResponse.json({ data: created });
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const body = await request.json();

  const updated = await PetitionModel.findOneAndUpdate(
    {
      orgId: Number(params.orgId),
      petitionId: Number(params.petitionId),
    },
    body,
    { new: true, upsert: true }
  );

  return NextResponse.json({ data: updated });
}
