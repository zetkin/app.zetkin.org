import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import isEmail from 'validator/lib/isEmail';

import { EventSignupModel } from 'features/events/models';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';

type RouteMeta = {
  params: {
    eventId: string;
    orgId: string;
  };
};

type EventSignupBody = {
  email?: string;
  first_name: string;
  gdpr_consent: boolean;
  last_name: string;
  phone?: string;
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request,
      roles: ['organizer', 'admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const eventSignups = await EventSignupModel.find({
        eventId: parseInt(params.eventId),
        orgId,
      });

      return NextResponse.json({ data: eventSignups }, { status: 200 });
    }
  );
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const body: EventSignupBody = await request.json();

  if (!body.first_name || !body.last_name) {
    return NextResponse.json(
      { error: 'first_name and last_name are required' },
      { status: 400 }
    );
  }

  if (body.gdpr_consent !== true) {
    return NextResponse.json(
      { error: 'gdpr_consent is required' },
      { status: 400 }
    );
  }

  if (body.email && !isEmail(body.email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  const eventSignup = await EventSignupModel.create({
    created: new Date(),
    email: body.email,
    eventId: parseInt(params.eventId),
    first_name: body.first_name,
    gdpr_consent: body.gdpr_consent,
    last_name: body.last_name,
    orgId: parseInt(params.orgId),
    phone: body.phone,
  });

  return NextResponse.json({ data: eventSignup }, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request,
      roles: ['organizer', 'admin'],
    },
    async () => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const { searchParams } = new URL(request.url);
      const signupId = searchParams.get('id');

      if (!signupId) {
        return NextResponse.json(
          { error: 'id query parameter is required' },
          { status: 400 }
        );
      }

      const result = await EventSignupModel.findByIdAndDelete(signupId);

      if (!result) {
        return NextResponse.json(
          { error: 'Signup not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: result }, { status: 200 });
    }
  );
}
