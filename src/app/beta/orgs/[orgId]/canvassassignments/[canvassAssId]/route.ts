import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { CanvassAssignmentModel } from 'features/areas/models';
import { ZetkinCanvassAssignment } from 'features/areas/types';

type RouteMeta = {
  params: {
    canvassAssId: string;
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

      const canvassAssignmentModel = await CanvassAssignmentModel.findOne({
        _id: params.canvassAssId,
        orgId,
      });

      if (!canvassAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const canvassAssignment: ZetkinCanvassAssignment = {
        campId: canvassAssignmentModel.campId,
        id: canvassAssignmentModel._id.toString(),
        orgId: orgId,
        title: canvassAssignmentModel.title,
      };

      return Response.json({ data: canvassAssignment });
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
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = await CanvassAssignmentModel.findOneAndUpdate(
        { _id: params.canvassAssId },
        {
          title: payload.title,
        },
        { new: true }
      );

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          campId: model.campId,
          id: model._id.toString(),
          orgId,
          title: model.title,
        },
      });
    }
  );
}
