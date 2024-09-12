import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { CanvassAssigneeModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    assigneeId: string;
    canvassAssId: string;
    orgId: string;
  };
};

export async function PUT(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const model = new CanvassAssigneeModel({
        canvassAssId: params.canvassAssId,
        id: params.assigneeId,
      });

      await model.save();

      return NextResponse.json({
        data: {
          id: model.id,
        },
      });
    }
  );
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = await CanvassAssigneeModel.findOneAndUpdate(
        {
          canvassAssId: params.canvassAssId,
          id: params.assigneeId,
        },
        {
          areaUrl: payload.areaUrl,
          id: params.assigneeId,
        },
        { new: true }
      );

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          areaUrl: model.areaUrl,
          id: model.id,
        },
      });
    }
  );
}
