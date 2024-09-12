import mongoose from 'mongoose';
import { NextRequest } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { IndividualCanvassAssignmentModel } from 'features/areas/models';
import { ZetkinIndividualCanvassAssignment } from 'features/areas/types';

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

      const individualCanvassAssingmentModels =
        await IndividualCanvassAssignmentModel.find({
          canvassAssId: params.canvassAssId,
        });

      const individualCanvassAssignments: ZetkinIndividualCanvassAssignment[] =
        individualCanvassAssingmentModels.map((model) => ({
          areaUrl: model.areaUrl,
          id: model._id.toString(),
          personId: model.personId,
        }));

      return Response.json({ data: individualCanvassAssignments });
    }
  );
}
