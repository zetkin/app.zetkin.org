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

  const petitionDoc = await PetitionModel.findOne({
    petitionId: 1,
    orgId: Number(params.orgId),
  });

  return NextResponse.json({ data: petitionDoc });
}
