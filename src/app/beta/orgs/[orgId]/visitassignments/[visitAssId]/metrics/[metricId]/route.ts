import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinMetricModel } from 'features/visitassignments/models';

type RouteMeta = {
  params: {
    metricId: string;
    orgId: string;
    visitAssId: string;
  };
};

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
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

      const zetkinMetricModel = await ZetkinMetricModel.findOneAndUpdate(
        { id: params.metricId },
        {
          defines_success: payload.defines_success,
          description: payload.description,
          question: payload.question,
          type: payload.type,
        },
        { new: true }
      );
      if (!zetkinMetricModel) {
        return new NextResponse(null, { status: 406 });
      }

      return NextResponse.json({ data: zetkinMetricModel });
    }
  );
}

export async function DELETE(request: NextRequest, { params }: RouteMeta) {
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

      const result = await ZetkinMetricModel.findOneAndDelete({
        id: params.metricId,
      });
      if (!result) {
        return new NextResponse(null, { status: 404 });
      }

      return new NextResponse(null, { status: 204 });
    }
  );
}
