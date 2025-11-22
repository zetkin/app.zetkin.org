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
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
};

export async function POST(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const body: EventSignupBody = await request.json();

  if (!body.first_name || !body.last_name) {
    return NextResponse.json(
      { error: 'first_name and last_name are required' },
      { status: 400 }
    );
  }

  const eventSignup = await EventSignupModel.create({
    email: body.email,
    eventId: parseInt(params.eventId),
    first_name: body.first_name,
    last_name: body.last_name,
    orgId: parseInt(params.orgId),
    phone: body.phone,
  });

  return NextResponse.json({ data: eventSignup }, { status: 201 });
}

