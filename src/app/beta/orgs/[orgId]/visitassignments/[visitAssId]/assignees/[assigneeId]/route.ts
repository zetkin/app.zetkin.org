import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { VisitAssignmentModel } from 'features/visitassignments/models';
import { ZetkinVisitAssignee } from 'features/visitassignments/types';
import { ZetkinUser } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    assigneeId: string;
    orgId: string;
    visitAssId: string;
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
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const visitAssignmentModel = await VisitAssignmentModel.findOne({
        id: params.visitAssId,
        orgId,
      });

      if (!visitAssignmentModel) {
        return new NextResponse(null, { status: 406 });
      }

      const isUserAlreadyAssigned = visitAssignmentModel.assignees.some(
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

      const newAssignee: ZetkinVisitAssignee = {
        excluded_tags: [],
        first_name: assigneeInfo.first_name,
        id: parseInt(params.assigneeId),
        last_name: assigneeInfo.last_name,
        prioritized_tags: [],
        visitAssId: parseInt(params.visitAssId),
      };
      visitAssignmentModel.assignees.push(newAssignee);

      await visitAssignmentModel.save();

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
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const payload = await request.json();

      const visitAssignmentModel = await VisitAssignmentModel.findOne({
        id: params.visitAssId,
        orgId,
      });

      if (!visitAssignmentModel) {
        return new NextResponse(null, { status: 406 });
      }

      const existingAssigneeIndex = visitAssignmentModel.assignees.findIndex(
        (assignee) => assignee.id === parseInt(params.assigneeId)
      );

      if (existingAssigneeIndex === -1) {
        return new NextResponse(
          JSON.stringify({ error: 'Assignee not found' }),
          { status: 404 }
        );
      }

      visitAssignmentModel.assignees[existingAssigneeIndex].excluded_tags =
        payload.excluded_tags || [];
      visitAssignmentModel.assignees[existingAssigneeIndex].prioritized_tags =
        payload.prioritized_tags || [];

      await visitAssignmentModel.save();

      return NextResponse.json({
        data: visitAssignmentModel.assignees[existingAssigneeIndex],
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
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const visitAssignmentModel = await VisitAssignmentModel.findOne({
        id: params.visitAssId,
        orgId,
      });

      if (!visitAssignmentModel) {
        return new NextResponse(null, { status: 406 });
      }

      const existingAssigneeIndex = visitAssignmentModel.assignees.findIndex(
        (assignee) => assignee.id === parseInt(params.assigneeId)
      );

      if (existingAssigneeIndex === -1) {
        return new NextResponse(
          JSON.stringify({ error: 'Assignee not found' }),
          { status: 404 }
        );
      }

      visitAssignmentModel.assignees.splice(existingAssigneeIndex, 1);

      await visitAssignmentModel.save();

      return NextResponse.json({
        data: visitAssignmentModel.assignees,
      });
    }
  );
}
