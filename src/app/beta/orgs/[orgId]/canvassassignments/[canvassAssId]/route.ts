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
