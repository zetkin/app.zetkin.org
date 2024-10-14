import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { PlaceModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    orgId: string;
    placeId: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteMeta) {
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
          $push: {
            households: {
              $each: [
                {
                  id: new mongoose.Types.ObjectId().toString(),
                  ratings: [],
                  title: payload.title,
                  visits: [],
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
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
          type: model.type,
        },
      });
    }
  );
}
