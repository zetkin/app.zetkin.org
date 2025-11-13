import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { VisitAssignmentModel } from 'features/visitassignments/models';

type RouteMeta = {
  params: {
    campId: string;
    orgId: string;
    visitAssId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const visitAssignmentModel = await VisitAssignmentModel.findOne({
        campId: params.campId,
        id: params.visitAssId,
        orgId,
      });

      if (!visitAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: visitAssignmentModel.assignees,
      });
    }
  );
}
