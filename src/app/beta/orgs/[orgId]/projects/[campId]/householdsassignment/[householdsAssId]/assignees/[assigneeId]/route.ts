import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { HouseholdsAssignmentModel } from 'features/householdsAssignments/models';
import { ZetkinHouseholdsAssignee } from 'features/householdsAssignments/types';
import { ZetkinUser } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    assigneeId: string;
    campId: string;
    householdsAssId: string;
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
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const householdAssignmentModel = await HouseholdsAssignmentModel.findOne({
        campId: params.campId,
        id: params.householdsAssId,
        orgId,
      });

      if (!householdAssignmentModel) {
        return new NextResponse(null, { status: 406 });
      }

      const isUserAlreadyAssigned = householdAssignmentModel.assignees.some(
        (assignee) => assignee.id === parseInt(params.assigneeId)
      );

      if (isUserAlreadyAssigned) {
        return new NextResponse(
          JSON.stringify({ error: 'User is already assigned' }),
          { status: 409 }
        );
      }

      const assigneeInfo = await apiClient.get<ZetkinUser>(
        `/api/orgs/${orgId}/people/${params.assigneeId}`
      );

      const newAssignee: ZetkinHouseholdsAssignee = {
        excluded_tags: [],
        first_name: assigneeInfo.first_name,
        householdsAssId: parseInt(params.householdsAssId),
        id: parseInt(params.assigneeId),
        last_name: assigneeInfo.last_name,
        prioritized_tags: [],
      };
      householdAssignmentModel.assignees.push(newAssignee);

      await householdAssignmentModel.save();

      return Response.json({ data: newAssignee });
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

      const householdAssignmentModel = await HouseholdsAssignmentModel.findOne({
        campId: params.campId,
        id: params.householdsAssId,
        orgId,
      });

      if (!householdAssignmentModel) {
        return new NextResponse(null, { status: 406 });
      }

      const existingAssigneeIndex =
        householdAssignmentModel.assignees.findIndex(
          (assignee) => assignee.id === parseInt(params.assigneeId)
        );

      if (existingAssigneeIndex === -1) {
        return new NextResponse(
          JSON.stringify({ error: 'Assignee not found' }),
          { status: 404 }
        );
      }

      householdAssignmentModel.assignees[existingAssigneeIndex].excluded_tags =
        payload.excluded_tags || [];
      householdAssignmentModel.assignees[
        existingAssigneeIndex
      ].prioritized_tags = payload.prioritized_tags || [];

      await householdAssignmentModel.save();

      return NextResponse.json({
        data: householdAssignmentModel.assignees[existingAssigneeIndex],
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

      const householdAssignmentModel = await HouseholdsAssignmentModel.findOne({
        campId: params.campId,
        id: params.householdsAssId,
        orgId,
      });

      if (!householdAssignmentModel) {
        return new NextResponse(null, { status: 406 });
      }

      const existingAssigneeIndex =
        householdAssignmentModel.assignees.findIndex(
          (assignee) => assignee.id === parseInt(params.assigneeId)
        );

      if (existingAssigneeIndex === -1) {
        return new NextResponse(
          JSON.stringify({ error: 'Assignee not found' }),
          { status: 404 }
        );
      }

      householdAssignmentModel.assignees.splice(existingAssigneeIndex, 1);

      await householdAssignmentModel.save();

      return NextResponse.json({
        data: householdAssignmentModel.assignees,
      });
    }
  );
}
