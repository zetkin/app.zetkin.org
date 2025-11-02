import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { HouseholdsAssignmentModel } from 'features/householdsAssignments/models';
import { ZetkinHouseholdAssignment } from 'features/householdsAssignments/types';

type RouteMeta = {
  params: {
    campId: string;
    householdsAssId: string;
    orgId: string;
    userId: string;
  };
};

export async function PUT(request: NextRequest, { params }: RouteMeta) {
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
        return new NextResponse(null, { status: 406 });
      }

      const newAssignee = {
        householdsAssId: parseInt(params.householdsAssId),
        user_id: parseInt(params.userId),
      };
      householdAssignmentModel.assignees.push(newAssignee);

      await householdAssignmentModel.save();

      const householdAssignment: ZetkinHouseholdAssignment = {
        assignees: householdAssignmentModel.assignees,
        campId: householdAssignmentModel.campId,
        end_date: householdAssignmentModel.end_date,
        id: householdAssignmentModel.id.toString(),
        orgId: orgId,
        start_date: householdAssignmentModel.start_date,
        target: householdAssignmentModel.target,
        title: householdAssignmentModel.title,
      };

      return Response.json({ data: householdAssignment });
    }
  );
}
