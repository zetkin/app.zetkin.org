import mongoose from 'mongoose';
import { NextRequest } from 'next/server';

import { AreaModel } from 'features/areas/models';
import { ZetkinArea } from 'features/areas/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const areaModels = await AreaModel.find({ orgId: parseInt(params.orgId) });
  const areas: ZetkinArea[] = areaModels.map((model) => ({
    id: model.id,
    points: model.points,
  }));

  return Response.json({ data: areas });
}
