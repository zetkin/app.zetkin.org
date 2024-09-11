import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { CanvassAssignmentModel } from 'features/areas/models';

type RouteMeta = {
  params: {
    orgId: string;
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

      const model = new CanvassAssignmentModel({
        campId: payload.campId,
        orgId: orgId,
        title: payload.title,
      });

      await model.save();

      return NextResponse.json({
        data: {
          campId: model.campId,
          id: model._id.toString(),
          orgId: orgId,
          title: model.title,
        },
      });
    }
  );
}
