import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { LocationModel } from 'features/areaAssignments/models';
import { ZetkinLocation } from 'features/areaAssignments/types';
import asAreaAssigneeAuthorized from 'features/areaAssignments/utils/asAreaAssigneeAuthorized';

type RouteMeta = {
  params: {
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asAreaAssigneeAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const locationModels = await LocationModel.find({ orgId });
      const locations: ZetkinLocation[] = locationModels.map((model) => ({
        description: model.description,
        households: model.households,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
      }));

      return Response.json({ data: locations });
    }
  );
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asAreaAssigneeAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = new LocationModel({
        description: payload.description,
        households: [],
        orgId: orgId,
        position: payload.position,
        title: payload.title,
      });

      await model.save();

      return NextResponse.json({
        data: {
          description: model.description,
          households: model.households,
          id: model._id.toString(),
          orgId: orgId,
          position: model.position,
          title: model.title,
        },
      });
    }
  );
}
