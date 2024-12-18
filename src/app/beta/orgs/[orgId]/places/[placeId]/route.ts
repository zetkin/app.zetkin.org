import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { PlaceModel } from 'features/areaAssignments/models';
import asAreaAssigneeAuthorized from 'features/areaAssignments/utils/asAreaAssigneeAuthorized';

type RouteMeta = {
  params: {
    orgId: string;
    placeId: string;
  };
};

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  return asAreaAssigneeAuthorized(
    {
      orgId: params.orgId,
      request: request,
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
        },
      });
    }
  );
}
