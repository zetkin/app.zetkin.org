import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { VisitAssignmentModel } from 'features/visitassignments/models';
import { ZetkinVisitAssignment } from 'features/visitassignments/types';
import { ZetkinQuery } from 'features/smartSearch/components/types';

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
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const visitAssignmentModel = await VisitAssignmentModel.findOne({
        campId: params.campId,
        id: params.visitAssId,
        orgId,
      });

      if (!visitAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const target = await apiClient.get<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries/${visitAssignmentModel.queryId}`
      );

      const visitAssignment: ZetkinVisitAssignment = {
        assignees: visitAssignmentModel.assignees,
        campaign: { id: visitAssignmentModel.campId },
        end_date: visitAssignmentModel.end_date,
        id: visitAssignmentModel.id.toString(),
        organization: { id: orgId },
        queryId: visitAssignmentModel.queryId,
        start_date: visitAssignmentModel.start_date,
        target: target,
        title: visitAssignmentModel.title,
      };

      return Response.json({ data: visitAssignment });
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

      const visitAssignmentModel = await VisitAssignmentModel.findOneAndUpdate(
        {
          campId: params.campId,
          id: params.visitAssId,
          orgId,
        },
        {
          assignees: payload.assignees,
          end_date: payload.end_date,
          start_date: payload.start_date,
          title: payload.title,
        },
        { new: true }
      );
      if (!visitAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({ data: visitAssignmentModel });
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

      const result = await VisitAssignmentModel.findOneAndDelete({
        campId: params.campId,
        id: params.visitAssId,
        orgId,
      });
      if (!result) {
        return new NextResponse(null, { status: 404 });
      }

      return new NextResponse(null, { status: 204 });
    }
  );
}
