import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import { ZetkinArea } from 'features/areas/types';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

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

      const areaModels = await AreaModel.find({ orgId });
      const areas: ZetkinArea[] = areaModels.map((model) => ({
        description: model.description,
        id: model._id.toString(),
        markers: model.markers,
        numberOfActions: model.numberOfActions,
        organization: {
          id: orgId,
        },
        points: model.points,
        title: model.title,
      }));

      return Response.json({ data: areas });
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

      const model = new AreaModel({
        description: payload.description,
        markers: [], //kanske detta inte går? att den måste ha ett innehåll?
        numberOfActions: 0,
        orgId: orgId,
        points: payload.points,
        title: payload.title,
      });

      await model.save();

      return NextResponse.json({
        data: {
          description: model.description,
          id: model._id.toString(),
          markers: model.markers,
          numberOfActions: model.numberOfActions,
          organization: {
            id: orgId,
          },
          points: model.points,
          title: model.title,
        },
      });
    }
  );
}
