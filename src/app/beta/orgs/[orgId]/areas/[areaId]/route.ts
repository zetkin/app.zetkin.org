import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinArea } from 'features/areas/types';

type RouteMeta = {
  params: {
    areaId: string;
    orgId: string;
  };
};

export function GET() {
  const area: ZetkinArea = {
    description: null,
    id: '2',
    organization: {
      id: 1,
    },
    points: [
      [55.59361532349994, 12.977986335754396],
      [55.5914203134015, 12.97790050506592],
      [55.59045010406615, 12.977342605590822],
      [55.59007414150065, 12.979617118835451],
      [55.58915241158536, 12.983243465423586],
      [55.589698175333524, 12.983586788177492],
      [55.59359106991554, 12.983479499816896],
    ],
    title: null,
  };

  return Response.json({
    data: area,
  });
}

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

      const model = await AreaModel.findOneAndUpdate(
        { _id: params.areaId },
        {
          description: payload.description,
          points: payload.points,
          title: payload.title,
        },
        { new: true }
      );

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          description: model.description,
          id: model._id.toString(),
          organization: {
            id: orgId,
          },
          points: model.points,
          title: model.title,
        },
      });
    }
  );
}

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');
      await AreaModel.findOneAndDelete({ _id: params.areaId });

      return new NextResponse(null, { status: 204 });
    }
  );
}
