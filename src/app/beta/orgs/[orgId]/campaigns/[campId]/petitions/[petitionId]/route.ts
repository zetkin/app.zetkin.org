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
    id: Number(params.petitionId),
    orgId: Number(params.orgId),
  });

  return NextResponse.json({ data: petitionDoc });
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
