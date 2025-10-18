import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { HouseholdsAssignmentModel } from 'features/householdsAssignments/models';
import { ZetkinHouseholdAssignment } from 'features/householdsAssignments/types';

type RouteMeta = {
  params: {
    campId: string;
    householdAssId: string;
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
        _id: params.householdAssId,
        campId: params.campId,
        orgId,
      });

      if (!householdAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const householdAssignment: ZetkinHouseholdAssignment = {
        assignees: householdAssignmentModel.assigneeIds,
        campId: householdAssignmentModel.campId,
        end_date: householdAssignmentModel.end_date,
        id: householdAssignmentModel._id.toString(),
        orgId: orgId,
        start_date: householdAssignmentModel.start_date,
        target: householdAssignmentModel.queryId.toString(),
        title: householdAssignmentModel.title,
      };

      return Response.json({ data: householdAssignment });
    }
  );
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const householdAssignmentModel =
        await HouseholdsAssignmentModel.findOneAndUpdate(
          {
            _id: params.householdAssId,
            campId: params.campId,
            orgId,
          },
          {
            assigneeIds: payload.assigneeIds,
            queryId: payload.queryId,
            title: payload.title,
          },
          { new: true }
        );

      if (!householdAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          campaign: { id: householdAssignmentModel.campId },
          id: householdAssignmentModel._id.toString(),
          organization: { id: orgId },
          title: householdAssignmentModel.title,
        },
      });
    }
  );
}
