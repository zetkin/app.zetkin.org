import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { AreaAssignmentModel } from 'features/areaAssignments/models';
import {
  ZetkinAreaAssignment,
  ZetkinMetric,
} from 'features/areaAssignments/types';

type RouteMeta = {
  params: {
    areaAssId: string;
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

      const areaAssignmentModel = await AreaAssignmentModel.findOne({
        _id: params.areaAssId,
        orgId,
      });

      if (!areaAssignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const areaAssignment: ZetkinAreaAssignment = {
        campaign: { id: areaAssignmentModel.campId },
        end_date: areaAssignmentModel.end_date,
        id: areaAssignmentModel._id.toString(),
        instructions: areaAssignmentModel.instructions,
        metrics: (areaAssignmentModel.metrics || []).map((metric) => ({
          definesDone: metric.definesDone || false,
          description: metric.description || '',
          id: metric._id,
          kind: metric.kind,
          question: metric.question,
        })),
        organization: { id: orgId },
        reporting_level: areaAssignmentModel.reporting_level || 'household',
        start_date: areaAssignmentModel.start_date,
        title: areaAssignmentModel.title,
      };

      return Response.json({ data: areaAssignment });
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
      const {
        instructions,
        metrics: newMetrics,
        title,
        start_date,
        end_date,
        reporting_level,
      } = payload;

      if (newMetrics) {
        // Find existing metrics to remove
        const assignment = await AreaAssignmentModel.findById(
          params.areaAssId
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
          await AreaAssignmentModel.updateOne(
            { _id: params.areaAssId },
            { $pull: { metrics: { _id: { $in: metricsToDelete } } } }
          );
        }

        for (const metric of newMetrics) {
          if (metric.id) {
            // If the metric has an ID, update it
            await AreaAssignmentModel.updateOne(
              { _id: params.areaAssId, 'metrics._id': metric.id },
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
            await AreaAssignmentModel.updateOne(
              { _id: params.areaAssId },
              {
                $push: { metrics: metric },
              }
            );
          }
        }
      }
      type UpdateFieldsType = Partial<
        Pick<
          ZetkinAreaAssignment,
          | 'title'
          | 'start_date'
          | 'end_date'
          | 'reporting_level'
          | 'instructions'
        >
      >;

      const updateFields: UpdateFieldsType = {};

      if (title !== null) {
        updateFields.title = title;
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'start_date')) {
        updateFields.start_date = start_date;
      }

      if (reporting_level) {
        updateFields.reporting_level = reporting_level;
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'end_date')) {
        updateFields.end_date = end_date;
      }

      if (instructions) {
        updateFields.instructions = instructions;
      }

      if (Object.keys(updateFields).length > 0) {
        await AreaAssignmentModel.updateOne(
          { _id: params.areaAssId },
          { $set: updateFields }
        );
      }
      const model = await AreaAssignmentModel.findById(
        params.areaAssId
      ).populate('metrics');

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      return NextResponse.json({
        data: {
          campaign: { id: model.campId },
          end_date: model.end_date,
          id: model._id.toString(),
          instructions: model.instructions,
          metrics: (model.metrics || []).map((metric) => ({
            definesDone: metric.definesDone || false,
            description: metric.description || '',
            id: metric._id,
            kind: metric.kind,
            question: metric.question,
          })),
          organization: { id: orgId },
          reporting_level: model.reporting_level || 'household',
          start_date: model.start_date,
          title: model.title,
        },
      });
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
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const result = await AreaAssignmentModel.findOneAndDelete({
        _id: params.areaAssId,
        orgId: orgId,
      });

      if (!result) {
        return new NextResponse(null, { status: 404 });
      }

      return new NextResponse(null, { status: 204 });
    }
  );
}
