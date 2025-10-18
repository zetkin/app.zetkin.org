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
          assignees: assignment.assigneeIds,
          campaign: {
            id: assignment.campId,
          },
          id: assignment._id.toString(),
          organization: {
            id: orgId,
          },
          target: {
            id: assignment.queryId.toString(),
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
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const queryRes = await apiClient.post<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries`,
        {
          filter_spec: [],
          title: 'Untitled Household Assignment Query',
        }
      );

      const model = new HouseholdsAssignmentModel({
        assigneeIds: [],
        campId: params.campId,
        orgId: orgId,
        queryId: queryRes.id,
        title: payload.title,
      });

      await model.save();

      return NextResponse.json({
        data: {
          campaign: { id: model.campId },
          id: model._id.toString(),
          organization: { id: orgId },
          title: model.title,
        },
      });
    }
  );
}
