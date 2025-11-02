import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { HouseholdsAssignmentModel } from 'features/householdsAssignments/models';
import { ZetkinHouseholdAssignmentStats } from 'features/householdsAssignments/types';
import { ZetkinPerson } from 'utils/types/zetkin';

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

      const targetMatches = await apiClient.get<ZetkinPerson[]>(
        `/api/orgs/${orgId}/people/queries/${householdAssignmentModel.queryId}/matches`
      );

      const householdAssignmentStats: ZetkinHouseholdAssignmentStats = <
        ZetkinHouseholdAssignmentStats
      >{
        allTargets: targetMatches.length,
      };

      return Response.json({ data: householdAssignmentStats });
    }
  );
}
