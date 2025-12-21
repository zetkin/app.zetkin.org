import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinVisitModel } from 'features/visitassignments/models';

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

      const visits = ZetkinVisitModel.find({
        assignmentId: params.visitAssId,
      });

      return NextResponse.json({
        data: (await visits).map((visit) => ({
          assignmentId: visit.assignmentId,
          created: visit.created,
          creatorId: visit.creatorId,
          id: visit.id,
          responses: visit.responses,
          targetId: visit.targetId,
        })),
      });
    }
  );
}
