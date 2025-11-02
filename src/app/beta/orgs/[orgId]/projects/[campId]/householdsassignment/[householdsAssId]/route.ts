import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { HouseholdsAssignmentModel } from 'features/householdsAssignments/models';
import { ZetkinHouseholdAssignment } from 'features/householdsAssignments/types';
import { ZetkinQuery } from 'features/smartSearch/components/types';

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
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const householdAssignmentModel = await HouseholdsAssignmentModel.findOne({
        campId: params.campId,
        id: params.householdsAssId,
        orgId,
      });

      if (!householdAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const target = await apiClient.get<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries/${householdAssignmentModel.queryId}`
      );

      const householdAssignment: ZetkinHouseholdAssignment = {
        assignees: householdAssignmentModel.assignees,
        campId: householdAssignmentModel.campId,
        end_date: householdAssignmentModel.end_date,
        id: householdAssignmentModel.id.toString(),
        orgId: orgId,
        queryId: householdAssignmentModel.queryId,
        start_date: householdAssignmentModel.start_date,
        target: target,
        title: householdAssignmentModel.title,
      };

      return Response.json({ data: householdAssignment });
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

      const householdAssignmentModel =
        await HouseholdsAssignmentModel.findOneAndUpdate(
          {
            campId: params.campId,
            id: params.householdsAssId,
            orgId,
          },
          {
            assignees: payload.assignees,
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
          id: householdAssignmentModel.id.toString(),
          organization: { id: orgId },
          title: householdAssignmentModel.title,
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
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const result = await HouseholdsAssignmentModel.findOneAndDelete({
        campId: params.campId,
        id: params.householdsAssId,
        orgId,
      });

      if (!result) {
        return new NextResponse(null, { status: 404 });
      }

      return new NextResponse(null, { status: 204 });
    }
  );
}
