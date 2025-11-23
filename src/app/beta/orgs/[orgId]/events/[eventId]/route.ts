import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { EventSignupModel } from 'features/events/models';

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
  await mongoose.connect(process.env.MONGODB_URL || '');
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));

  const eventSignups = await EventSignupModel.find({
    eventId: parseInt(params.eventId),
  });

  return NextResponse.json({ data: eventSignups }, { status: 200 });
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

  const eventSignup = await EventSignupModel.create({
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
