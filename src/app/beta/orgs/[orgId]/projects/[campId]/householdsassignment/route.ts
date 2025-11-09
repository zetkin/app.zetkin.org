import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { HouseholdsAssignmentModel } from 'features/householdsAssignments/models';
import { ZetkinQuery } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    campId: string;
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

      const assignments = HouseholdsAssignmentModel.find({ orgId: orgId });

      return NextResponse.json({
        data: (await assignments).map((assignment) => ({
          assignees: assignment.assignees,
          campaign: {
            id: assignment.campId,
          },
          id: assignment.id.toString(),
          organization: {
            id: orgId,
          },
          queryId: assignment.queryId,
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
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const queryRes = await apiClient.post<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries`,
        {
          filter_spec: [],
          title: `${payload.title} Query`,
        }
      );

      const model = new HouseholdsAssignmentModel({
        assigneeIds: [],
        campId: params.campId,
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
