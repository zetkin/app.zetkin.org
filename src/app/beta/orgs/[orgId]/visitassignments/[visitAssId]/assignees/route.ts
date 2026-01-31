import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinVisitAssigneeModel } from 'features/visitassignments/models';

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
    async () => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const assignees = await ZetkinVisitAssigneeModel.find({
        visitAssId: params.visitAssId,
      });

      return NextResponse.json({
        data: assignees.map((assignee) => ({
          excluded_tags: assignee.excluded_tags,
          first_name: assignee.first_name,
          id: assignee.id,
          last_name: assignee.last_name,
          orgId: assignee.orgId,
          prioritized_tags: assignee.prioritized_tags,
          user_id: assignee.id,
          visitAssId: assignee.visitAssId,
        })),
      });
    }
  );
}
