import mongoose from 'mongoose';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinTag } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    areaId: string;
    orgId: string;
    tagId: string;
  };
};

export async function PUT(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId, apiClient }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      try {
        const tag = await apiClient.get<ZetkinTag>(
          `/api/orgs/${orgId}/people/tags/${params.tagId}`
        );

        const area = await AreaModel.findOne({ _id: params.areaId });
        if (!area) {
          return notFound();
        }

        let value: string | undefined = undefined;
        try {
          const payload = await request.json();
          value = payload.value;
        } catch (err) {
          // Ignore this
        }

        const existingTags = area.tags || [];
        area.tags = [
          // Other tags
          ...existingTags.filter((item) => item.id != parseInt(params.tagId)),
          // New tag
          { id: parseInt(params.tagId), value: value },
        ];

        await area.save();

        return NextResponse.json({
          data: {
            ...tag,
            value: value,
          },
        });
      } catch (err) {
        return notFound();
      }
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

      const area = await AreaModel.findOne({ _id: params.areaId });
      if (!area) {
        return notFound();
      }

      const existingTags = area.tags || [];
      area.tags = existingTags.filter(
        (item) => item.id != parseInt(params.tagId)
      );

      await area.save();

      return new NextResponse(null, { status: 204 });
    }
  );
}
