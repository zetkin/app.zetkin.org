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
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin', 'organizer'],
    },
    async ({ orgId, apiClient }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const tags: ZetkinTag[] = [];

      const area = await AreaModel.findOne({ _id: params.areaId });
      if (area) {
        for await (const tagMeta of area.tags) {
          const tag = await apiClient.get<ZetkinTag>(
            `/api/orgs/${orgId}/people/tags/${tagMeta.id}`
          );

          tags.push({
            ...tag,
            value: tagMeta.value,
          });
        }

        return NextResponse.json({
          data: tags,
        });
      } else {
        return notFound();
      }
    }
  );
}
