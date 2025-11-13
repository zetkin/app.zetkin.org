import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { VisitAssignmentModel } from 'features/visitassignments/models';

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
      roles: ['admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONOGODB_URL || '');

      const assignments = VisitAssignmentModel.find({ orgId: orgId });

      return NextResponse.json({
        data: (await assignments).map((assignment) => ({
          campaign: {
            id: assignment.campId,
          },
          id: assignment.id.toString(),
          organization: {
            id: orgId,
          },
        })),
      });
    }
  );
}
