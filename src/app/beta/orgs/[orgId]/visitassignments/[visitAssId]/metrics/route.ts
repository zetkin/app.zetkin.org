import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinMetricModel } from 'features/visitassignments/models';

type RouteMeta = {
  params: {
    orgId: string;
    visitAssId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async () => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const metrics = ZetkinMetricModel.find({
        visit_assignment_id: params.visitAssId,
      });

      return NextResponse.json({
        data: (await metrics).map((metric) => ({
          created: metric.created,
          defines_success: metric.defines_success,
          description: metric.description,
          id: metric.id,
          question: metric.question,
          type: metric.type,
        })),
      });
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
    async () => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const payload = await request.json();

      const model = new ZetkinMetricModel({
        created: new Date().toISOString(),
        defines_success: false,
        description: payload.description,
        id: 0,
        question: payload.question,
        type: payload.type,
        visit_assignment_id: params.visitAssId,
      });
      await model.save();

      return NextResponse.json({ data: model }, { status: 201 });
    }
  );
}
