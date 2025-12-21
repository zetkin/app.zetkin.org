import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson } from 'utils/types/zetkin';
import { VisitAssignmentModel } from 'features/visitassignments/models';

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

      const assignment = await VisitAssignmentModel.findOne({
        id: params.visitAssId,
        orgId,
      });
      if (!assignment) {
        return new NextResponse(null, { status: 404 });
      }

      const people = await apiClient.get<ZetkinPerson[]>(
        `/api/orgs/${orgId}/people`
      );
      const targets = await apiClient.get<ZetkinPerson[]>(
        `/api/orgs/${orgId}/people/queries/${assignment.queryId}/matches`
      );

      const targetIds = new Set(targets.map((person) => person.id));
      const enrichedTargets = people.filter((person) =>
        targetIds.has(person.id)
      );

      return NextResponse.json(
        {
          data: enrichedTargets,
        },
        { status: 200 }
      );
    }
  );
}
