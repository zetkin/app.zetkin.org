import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { HouseholdsAssignmentModel } from 'features/householdsAssignments/models';

type RouteMeta = {
  params: {
    campId: string;
    householdsAssId: string;
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
      await mongoose.connect(process.env.MONGODB_URL || '');

      const householdAssignmentModel = await HouseholdsAssignmentModel.findOne({
        campId: params.campId,
        id: params.householdsAssId,
        orgId,
      });

      if (!householdAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        assignees: householdAssignmentModel.assignees,
      });
    }
  );
}
