import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { VisitAssignmentModel } from 'features/visitassignments/models';
import { ZetkinVisitAssignmentStats } from 'features/visitassignments/types';
import { ZetkinPerson } from 'utils/types/zetkin';

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

      const targetMatches = await apiClient.get<ZetkinPerson[]>(
        `/api/orgs/${orgId}/people/queries/${visitAssignmentModel.queryId}/matches`
      );

      const visitAssignmentStats: ZetkinVisitAssignmentStats = <
        ZetkinVisitAssignmentStats
      >{
        allTargets: targetMatches.length,
      };

      return Response.json({ data: visitAssignmentStats });
    }
  );
}
