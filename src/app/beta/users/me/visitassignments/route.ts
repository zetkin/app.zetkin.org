import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asUserAuthorized from 'utils/api/asUserAuthorized';
import {
  VisitAssignmentModel,
  ZetkinVisitAssigneeModel,
} from 'features/visitassignments/models';

export async function GET(request: NextRequest) {
  return asUserAuthorized(
    {
      request: request,
    },
    async ({ userId }) => {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URL || '');
      }

      const assigneeDocs = await ZetkinVisitAssigneeModel.find(
        { id: userId },
        { _id: 0, visitAssId: 1 }
      )
        .lean()
        .exec();

      const visitAssIds = Array.from(
        new Set(assigneeDocs.map((d) => d.visitAssId))
      );

      if (visitAssIds.length === 0) {
        return NextResponse.json({ data: [] });
      }

      const projection = {
        _id: 0,
        campId: 1,
        end_date: 1,
        id: 1,
        orgId: 1,
        start_date: 1,
        title: 1,
      };

      const assignments = await VisitAssignmentModel.find({
        id: { $in: visitAssIds },
      })
        .select(projection)
        .lean()
        .exec();

      return NextResponse.json({
        data: assignments.map((assignment) => ({
          campaign: { id: assignment.campId },
          end_date: assignment.end_date,
          id: assignment.id,
          organization: { id: assignment.orgId },
          start_date: assignment.start_date,
          title: assignment.title,
        })),
      });
    }
  );
}
