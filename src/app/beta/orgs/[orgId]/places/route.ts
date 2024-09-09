import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { PlaceModel } from 'features/areas/models';
import { ZetkinPlace } from 'features/areas/types';

type RouteMeta = {
  params: {
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin', 'organizer'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const placeModels = await PlaceModel.find({ orgId });
      const places: ZetkinPlace[] = placeModels.map((model) => ({
        description: model.description,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
        type: model.type,
        visits: model.visits,
      }));

      return Response.json({ data: places });
    }
  );
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = new PlaceModel({
        description: payload.description,
        orgId: orgId,
        position: payload.position,
        title: payload.title,
        type: payload.type,
        visits: payload.visits,
      });

      await model.save();

      return NextResponse.json({
        data: {
          description: model.description,
          id: model._id.toString(),
          orgId: orgId,
          position: model.position,
          title: model.title,
          type: model.type,
          visits: model.visits,
        },
      });
    }
  );
}
