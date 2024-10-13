import mongoose from 'mongoose';
import { NextRequest } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { CanvassAssigneeModel } from 'features/areas/models';
import { ZetkinCanvassAssignee } from 'features/areas/types';

type RouteMeta = {
  params: {
    canvassAssId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin', 'organizer'],
    },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const canvassAssigneeModels = await CanvassAssigneeModel.find({
        canvassAssId: params.canvassAssId,
      });

      const assignees: ZetkinCanvassAssignee[] = canvassAssigneeModels.map(
        (model) => ({
          canvassAssId: model.canvassAssId,
          id: model.id,
        })
      );

      return Response.json({ data: assignees });
    }
  );
}
