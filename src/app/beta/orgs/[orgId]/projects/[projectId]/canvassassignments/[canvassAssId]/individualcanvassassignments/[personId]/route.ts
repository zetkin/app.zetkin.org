import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { IndividualCanvassAssignmentModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    canvassAssId: string;
    orgId: string;
    personId: string;
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

      const model = new IndividualCanvassAssignmentModel({
        canvassAssId: params.canvassAssId,
        personId: params.personId,
      });

      await model.save();

      return NextResponse.json({
        data: {
          id: model._id.toString(),
          personId: model.personId,
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

      const model = await IndividualCanvassAssignmentModel.findOneAndUpdate(
        {
          canvassAssId: params.canvassAssId,
          personId: params.personId,
        },
        {
          areaUrl: payload.areaUrl,
        },
        { new: true }
      );

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          areaUrl: model.areaUrl,
          id: model._id.toString(),
        },
      });
    }
  );
}
