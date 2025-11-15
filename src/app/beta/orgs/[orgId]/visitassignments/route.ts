import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { VisitAssignmentModel } from 'features/visitassignments/models';
import { ZetkinQuery } from 'features/smartSearch/components/types';

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
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const assignments = await VisitAssignmentModel.find({ orgId: orgId });

      return NextResponse.json({
        data: assignments.map((assignment) => ({
          campaign: {
            id: assignment.campId,
          },
          id: assignment.id.toString(),
          organization: {
            id: orgId,
          },
          title: assignment.title,
        })),
      });
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
    async ({ apiClient, orgId }) => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const payload = await request.json();

      const queryRes = await apiClient.post<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries`,
        {
          filter_spec: [],
          title: `${payload.title} Query`,
        }
      );

      const model = new VisitAssignmentModel({
        assigneeIds: [],
        campId: payload.campaign_id,
        end_date: null,
        id: 0,
        orgId: orgId,
        queryId: queryRes.id,
        start_date: null,
        target: null,
        title: payload.title,
      });
      await model.save();

      return NextResponse.json(
        {
          data: {
            campaign: { id: model.campId },
            id: model.id.toString(),
            organization: { id: orgId },
            target: queryRes,
            title: model.title,
          },
        },
        { status: 201 }
      );
    }
  );
}
