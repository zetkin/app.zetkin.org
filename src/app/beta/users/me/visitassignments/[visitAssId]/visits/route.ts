import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asUserAuthorized from 'utils/api/asUserAuthorized';
import { ZetkinVisitModel } from 'features/visitassignments/models';

type RouteMeta = {
  params: {
    orgId: string;
    visitAssId: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteMeta) {
  return asUserAuthorized(
    {
      request: request,
    },
    async ({ userId }) => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }
      const payload = await request.json();

      const model = new ZetkinVisitModel({
        assignmentId: params.visitAssId,
        created: new Date().toISOString(),
        creatorId: userId,
        id: 0,
        responses: payload.responses,
        targetId: payload.targetId,
      });
      await model.save();

      return NextResponse.json({ data: model }, { status: 201 });
    }
  );
}
