import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { DialingMode } from 'features/callAssignments/betaTypes';
import { DialingModeModel } from 'features/callAssignments/models';

type RouteMeta = {
  params: {
    callAssId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const dialingModeModel = await DialingModeModel.findOne({
    callAssId: params.callAssId,
  });

  const dialingMode: DialingMode = (dialingModeModel?.mode ??
    'manual') as DialingMode;

  return NextResponse.json({ data: dialingMode });
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const payload = await request.json();

  const dialingModeModel = await DialingModeModel.findOneAndUpdate(
    { callAssId: params.callAssId },
    {
      mode: payload.dialingMode,
    },
    { new: true, upsert: true }
  );

  return NextResponse.json({
    data: dialingModeModel?.mode,
  });
}
