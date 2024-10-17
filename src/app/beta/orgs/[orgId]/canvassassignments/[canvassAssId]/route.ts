import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { CanvassAssignmentModel } from 'features/canvassAssignments/models';
import {
  ZetkinCanvassAssignment,
  ZetkinMetric,
} from 'features/canvassAssignments/types';

type RouteMeta = {
  params: {
    canvassAssId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin', 'organizer'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const canvassAssignmentModel = await CanvassAssignmentModel.findOne({
        _id: params.canvassAssId,
        orgId,
      });

      if (!canvassAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const canvassAssignment: ZetkinCanvassAssignment = {
        campaign: { id: canvassAssignmentModel.campId },
        end_date: canvassAssignmentModel.end_date,
        id: canvassAssignmentModel._id.toString(),
        metrics: (canvassAssignmentModel.metrics || []).map((metric) => ({
          definesDone: metric.definesDone || false,
          description: metric.description || '',
          id: metric._id,
          kind: metric.kind,
          question: metric.question,
        })),
        organization: { id: orgId },
        start_date: canvassAssignmentModel.start_date,
        title: canvassAssignmentModel.title,
      };

      return Response.json({ data: canvassAssignment });
    }
  );
}

export async function PATCH(request: NextRequest, { params }: RouteMeta) {
  return asOrgAuthorized(
    {
      orgId: params.orgId,
      request: request,
      roles: ['admin'],
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const payload = await request.json();
      const { metrics: newMetrics, title, start_date, end_date } = payload;

      if (newMetrics) {
        // Find existing metrics to remove
        const assignment = await CanvassAssignmentModel.findById(
          params.canvassAssId
        ).select('metrics');

        if (!assignment) {
          return new NextResponse(null, { status: 404 });
        }

        const existingMetricsIds = assignment.metrics.map((metric) =>
          metric._id.toString()
        );

        // Identify metrics to be deleted
        const metricsToDelete = existingMetricsIds.filter(
          (id) => !newMetrics.some((metric: ZetkinMetric) => metric.id === id)
        );

        // Remove metrics that are no longer included
        if (metricsToDelete.length > 0) {
          await CanvassAssignmentModel.updateOne(
            { _id: params.canvassAssId },
            { $pull: { metrics: { _id: { $in: metricsToDelete } } } }
          );
        }

        for (const metric of newMetrics) {
          if (metric.id) {
            // If the metric has an ID, update it
            await CanvassAssignmentModel.updateOne(
              { _id: params.canvassAssId, 'metrics._id': metric.id },
              {
                $set: {
                  'metrics.$.definesDone': metric.definesDone,
                  'metrics.$.description': metric.description,
                  'metrics.$.kind': metric.kind,
                  'metrics.$.question': metric.question,
                },
              }
            );
          } else {
            // If no ID exists, push it as a new metric
            await CanvassAssignmentModel.updateOne(
              { _id: params.canvassAssId },
              {
                $push: { metrics: metric },
              }
            );
          }
        }
      }
      type UpdateFieldsType = Partial<
        Pick<ZetkinCanvassAssignment, 'title' | 'start_date' | 'end_date'>
      >;

      const updateFields: UpdateFieldsType = {};

      if (title !== null) {
        updateFields.title = title;
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'start_date')) {
        updateFields.start_date = start_date;
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'end_date')) {
        updateFields.end_date = end_date;
      }

      if (Object.keys(updateFields).length > 0) {
        await CanvassAssignmentModel.updateOne(
          { _id: params.canvassAssId },
          { $set: updateFields }
        );
      }
      const model = await CanvassAssignmentModel.findById(
        params.canvassAssId
      ).populate('metrics');

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          campaign: { id: model.campId },
          end_date: model.end_date,
          id: model._id.toString(),
          metrics: (model.metrics || []).map((metric) => ({
            definesDone: metric.definesDone || false,
            description: metric.description || '',
            id: metric._id,
            kind: metric.kind,
            question: metric.question,
          })),
          organization: { id: orgId },
          start_date: model.start_date,
          title: model.title,
        },
      });
    }
  );
}
