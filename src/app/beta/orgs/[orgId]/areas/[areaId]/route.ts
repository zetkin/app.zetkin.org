import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    areaId: string;
    orgId: string;
  };
};

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = await AreaModel.findOneAndUpdate(
        { _id: params.areaId },
        {
          description: payload.description,
          points: payload.points,
          title: payload.title,
        },
        { new: true }
      );

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          description: model.description,
          id: model._id.toString(),
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

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');
      await AreaModel.findOneAndDelete({ _id: params.areaId });

      return new NextResponse(null, { status: 204 });
    }
  );
}
