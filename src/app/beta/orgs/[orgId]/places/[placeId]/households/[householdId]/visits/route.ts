import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { PlaceModel } from 'features/canvassAssignments/models';
import asCanvasserAuthorized from 'features/canvassAssignments/utils/asCanvasserAuthorized';

type RouteMeta = {
  params: {
    householdId: string;
    orgId: string;
    placeId: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asCanvasserAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId, personId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = await PlaceModel.findOneAndUpdate(
        { _id: params.placeId, orgId },
        {
          $push: {
            'households.$[elem].visits': {
              canvassAssId: payload.canvassAssId,
              doorWasOpened: payload.doorWasOpened,
              id: new mongoose.Types.ObjectId().toString(),
              missionAccomplished: payload.missionAccomplished,
              noteToOfficial: payload.noteToOfficial,
              personId: personId,
              responses: payload.responses || [],
              timestamp: payload.timestamp,
            },
          },
        },
        {
          arrayFilters: [{ 'elem.id': { $eq: params.householdId } }],
          new: true,
        }
      );

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      await model.save();

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
