import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinArea } from 'features/areas/types';
import { ZetkinTag } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    areaId: string;
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
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const areaModel = await AreaModel.findOne({ _id: params.areaId, orgId });
      const allTags = await apiClient.get<ZetkinTag[]>(
        `/api/orgs/${orgId}/people/tags`
      );

      if (!areaModel) {
        return new NextResponse(null, { status: 404 });
      }

      const tags: ZetkinTag[] = [];
      (areaModel.tags || []).forEach((item) => {
        const tag = allTags.find((tag) => tag.id == item.id);
        if (tag) {
          tags.push({
            ...tag,
            value: item.value,
          });
        }
      });

      const area: ZetkinArea = {
        description: areaModel.description,
        id: areaModel._id.toString(),
        organization: {
          id: orgId,
        },
        points: areaModel.points,
        tags: tags,
        title: areaModel.title,
      };

      return Response.json({ data: area });
    }
  );
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
