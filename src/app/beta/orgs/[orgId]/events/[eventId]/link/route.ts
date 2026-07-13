import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { EventSignupModel } from 'features/events/models';
import { ApiClientError } from 'core/api/errors';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinEventParticipant } from 'utils/types/zetkin';

type RouteMeta = {
  params: {
    eventId: string;
    orgId: string;
  };
};

type LinkRequestBody = {
  personId: number;
  signupId: string;
};

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request,
      roles: ['organizer', 'admin'],
    },
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const body: LinkRequestBody = await request.json();
      const { personId, signupId } = body;

      if (!signupId) {
        return NextResponse.json(
          { error: 'signupId is required' },
          { status: 400 }
        );
      }

      if (!personId) {
        return NextResponse.json(
          { error: 'personId is required' },
          { status: 400 }
        );
      }

      const signup = await EventSignupModel.findById(signupId);

      if (!signup) {
        return NextResponse.json(
          { error: 'Signup not found' },
          { status: 404 }
        );
      }

      try {
        // TODO: These two operations should be a single transaction in the future.
        await apiClient.put<ZetkinEventParticipant>(
          `/api/orgs/${orgId}/actions/${params.eventId}/participants/${personId}`,
          {}
        );

        await EventSignupModel.findByIdAndDelete(signupId);

        return NextResponse.json(
          { data: { personId, success: true } },
          { status: 200 }
        );
      } catch (err) {
        if (err instanceof ApiClientError) {
          return NextResponse.json(
            { error: 'Failed to book participant' },
            { status: err.status }
          );
        }
        return NextResponse.json(
          { error: 'Failed to book participant' },
          { status: 500 }
        );
      }
    }
  );
}
