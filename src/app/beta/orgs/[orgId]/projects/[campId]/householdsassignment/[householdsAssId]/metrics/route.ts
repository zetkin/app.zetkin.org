import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinMetricModel } from 'features/householdsAssignments/models';

type RouteMeta = {
  params: {
    campId: string;
    householdsAssId: string;
    orgId: string;
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
      await mongoose.connect(process.env.MONGODB_URL || '');

      const metrics = ZetkinMetricModel.find({
        household_assignment_id: params.householdsAssId,
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
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = new ZetkinMetricModel({
        created: new Date().toISOString(),
        defines_success: false,
        description: payload.description,
        household_assignment_id: params.householdsAssId,
        id: 0,
        question: payload.question,
        type: payload.type,
      });
      await model.save();

      return NextResponse.json({ data: model }, { status: 201 });
    }
  );
}
