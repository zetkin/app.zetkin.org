import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { VisitAssignmentModel } from 'features/visitassignments/models';
import { ZetkinQuery } from 'features/smartSearch/components/types';

type RouteMeta = {
  params: {
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
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const visitAssignmentModel = await VisitAssignmentModel.findOne({
        id: params.visitAssId,
        orgId,
      });

      if (!visitAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const target = await apiClient.get<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries/${visitAssignmentModel.queryId}`
      );

      return Response.json(
        {
          data: {
            campaign: { id: visitAssignmentModel.campId },
            end_date: visitAssignmentModel.end_date,
            id: visitAssignmentModel.id,
            organization: { id: orgId },
            queryId: visitAssignmentModel.queryId,
            start_date: visitAssignmentModel.start_date,
            target: target,
            title: visitAssignmentModel.title,
          },
        },
        { status: 200 }
      );
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

      const visitAssignmentModel = await VisitAssignmentModel.findOneAndUpdate(
        {
          id: params.visitAssId,
          orgId,
        },
        {
          assignees: payload.assignees,
          campId: payload.campaign_id,
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
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const result = await VisitAssignmentModel.findOneAndDelete({
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
