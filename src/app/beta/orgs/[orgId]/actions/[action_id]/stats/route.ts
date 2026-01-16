import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';

import { EventSignupModel } from 'features/events/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    action_id: string;
    orgId: string;
  };
};

const actionIdSchema = z.coerce.number().int().positive();
const orgIdSchema = z.coerce.number().int().positive();

export async function GET(request: NextRequest, { params }: RouteMeta) {
  const actionIdResult = actionIdSchema.safeParse(params.action_id);
  if (!actionIdResult.success) {
    return NextResponse.json({ error: 'Invalid action_id' }, { status: 400 });
  }

  const orgIdResult = orgIdSchema.safeParse(params.orgId);
  if (!orgIdResult.success) {
    return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
  }

  const actionId = actionIdResult.data;
  const orgId = orgIdResult.data;

  return asOrgAuthorized(
    {
      orgId: orgId,
      request,
      roles: ['organizer', 'admin'],
    },
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');
      const numSignups = await EventSignupModel.countDocuments({
        eventId: actionId,
        orgId,
      });

      const stats = await apiClient.get<{
        num_booked: number;
        num_pending: number;
        num_reminded: number;
        num_signups: number;
      }>(`/api/orgs/${orgId}/actions/${actionId}/stats`);

      return NextResponse.json(
        {
          data: {
            id: actionId,
            num_booked: stats.num_booked,
            num_pending: stats.num_pending + numSignups,
            num_reminded: stats.num_reminded,
            num_signups: stats.num_signups + numSignups,
          },
        },
        { status: 200 }
      );
    }
  );
}
