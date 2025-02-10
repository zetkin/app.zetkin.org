import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { AreaAssignmentModel } from 'features/areaAssignments/models';

type RouteMeta = {
  params: {
    areaId: string;
    assignmentId: string;
    orgId: string;
    personId: number;
  };
};

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },

    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');
      apiClient;
      orgId;

      const assignmentModel = await AreaAssignmentModel.findOne({
        _id: params.assignmentId,
      });

      if (!assignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const filteredSessions = assignmentModel.sessions.filter((session) => {
        return !(
          session.personId == params.personId && session.areaId == params.areaId
        );
      });

      assignmentModel.sessions = filteredSessions;

      await assignmentModel.save();

      return new NextResponse(null, { status: 204 });
    }
  );
}
