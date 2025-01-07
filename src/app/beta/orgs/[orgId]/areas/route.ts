import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import { ZetkinArea } from 'features/areas/types';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinTag } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
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

      const allTags = await apiClient.get<ZetkinTag[]>(
        `/api/orgs/${orgId}/people/tags`
      );

      const areaModels = await AreaModel.find({ orgId });
      const areas: ZetkinArea[] = areaModels.map((model) => {
        const tags: ZetkinTag[] = [];
        (model.tags || []).forEach((item) => {
          const tag = allTags.find((tag) => tag.id == item.id);
          if (tag) {
            tags.push({
              ...tag,
              value: item.value,
            });
          }
        });

        return {
          description: model.description,
          id: model._id.toString(),
          organization: {
            id: orgId,
          },
          points: model.points,
          tags: tags,
          title: model.title,
        };
      });

      return Response.json({ data: areas });
    }
  );
}

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

      const model = new AreaModel({
        description: payload.description,
        orgId: orgId,
        points: payload.points,
        title: payload.title,
      });

      await model.save();

      return NextResponse.json({
        data: {
          description: model.description,
          id: model._id.toString(),
          organization: {
            id: orgId,
          },
          points: model.points,
          tags: [],
          title: model.title,
        },
      });
    }
  );
}
