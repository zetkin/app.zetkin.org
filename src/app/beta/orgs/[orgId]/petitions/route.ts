// beta/orgs/[orgId]/petitions/[petitionId]/route.ts
import { PetitionModel } from 'features/petition/utils/models';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

interface RouteMeta {
  params: {
    orgId: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const body = await request.json();

  const created = await PetitionModel.create({
    orgId: Number(params.orgId),
    petitionId: 1, // static value for now
    ...body, // e.g. color, notes
  });

  return NextResponse.json(
    { data: created },
    { status: 201 } // ✅ return 201 Created
  );
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
