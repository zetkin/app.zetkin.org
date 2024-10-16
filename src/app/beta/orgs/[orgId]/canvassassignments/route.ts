import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { CanvassAssignmentModel } from 'features/canvassAssignments/models';

type RouteMeta = {
  params: {
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
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const assignments = CanvassAssignmentModel.find({ orgId: orgId });

      return NextResponse.json({
        data: (await assignments).map((assignment) => ({
          campaign: {
            id: assignment.campId,
          },
          id: assignment._id.toString(),
          metrics: (assignment.metrics || []).map((metric) => ({
            definesDone: metric.definesDone || false,
            description: metric.description || '',
            id: metric._id,
            kind: metric.kind,
            question: metric.question,
          })),
          organization: {
            id: orgId,
          },
          title: assignment.title,
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
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();

      const model = new CanvassAssignmentModel({
        campId: payload.campaign_id,
        metrics: payload.metrics || [],
        orgId: orgId,
        title: payload.title,
      });

      await model.save();

      return NextResponse.json({
        data: {
          campaign: { id: model.campId },
          id: model._id.toString(),
          metrics: model.metrics.map((metric) => ({
            _id: metric._id,
            definesDone: metric.definesDone || false,
            description: metric.description || '',
            kind: metric.kind,
            question: metric.question,
          })),
          organization: { id: orgId },
          title: model.title,
        },
      });
    }
  );
}
