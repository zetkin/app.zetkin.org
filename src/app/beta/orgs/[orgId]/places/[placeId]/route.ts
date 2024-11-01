import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { PlaceModel } from 'features/areas/models';

type RouteMeta = {
  params: {
    orgId: string;
    placeId: string;
  };
};

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = await PlaceModel.findOneAndUpdate(
        { _id: params.placeId, orgId },
        {
          description: payload.description,
          households: payload.households,
          position: payload.position,
          title: payload.title,
          type: payload.type,
        },
        { new: true }
      );

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          description: model.description,
          households: model.households,
          id: model._id.toString(),
          orgId: orgId,
          position: model.position,
          title: model.title,
          type: model.type,
        },
      });
    }
  );
}
