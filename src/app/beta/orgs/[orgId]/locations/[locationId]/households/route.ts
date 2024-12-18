import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { LocationModel } from 'features/areaAssignments/models';
import asAreaAssigneeAuthorized from 'features/areaAssignments/utils/asAreaAssigneeAuthorized';

type RouteMeta = {
  params: {
    locationId: string;
    orgId: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asAreaAssigneeAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = await LocationModel.findOneAndUpdate(
        { _id: params.locationId, orgId },
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
        },
      });
    }
  );
}
