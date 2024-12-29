import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import {
  AreaAssignmentModel,
  LocationVisitModel,
} from 'features/areaAssignments/models';
import asAreaAssigneeAuthorized from 'features/canvass/utils/asAreaAssigneeAuthorized';

type RouteMeta = {
  params: {
    areaAssId: string;
    orgId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteMeta) {
  const areaAssId = params.areaAssId;
  return asAreaAssigneeAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const assignmentModel = await AreaAssignmentModel.find({
        _id: areaAssId,
        orgId: orgId,
      });

      if (!assignmentModel) {
        return NextResponse.json({ error: {} }, { status: 404 });
      }

      const visitModels = await LocationVisitModel.find({
        areaAssId: areaAssId,
      });

      return NextResponse.json({
        data: visitModels.map((model) => ({
          areaAssId: model.areaAssId,
          id: model._id.toString(),
          locationId: model.locationId,
          personId: model.personId,
          responses: model.responses,
          timestamp: model.timestamp,
        })),
      });
    }
  );
}

export async function POST(request: NextRequest, { params }: RouteMeta) {
  const areaAssId = params.areaAssId;
  return asAreaAssigneeAuthorized(
    {
      orgId: params.orgId,
      request: request,
    },
    async ({ orgId, personId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const assignmentModel = await AreaAssignmentModel.find({
        _id: areaAssId,
        orgId: orgId,
      });

      if (!assignmentModel) {
        return NextResponse.json({ error: {} }, { status: 404 });
      }

      const payload = await request.json();

      const visit = new LocationVisitModel({
        areaAssId,
        locationId: payload.locationId,
        personId: personId,
        responses: payload.responses,
        timestamp: new Date().toISOString(),
      });

      await visit.save();

      return NextResponse.json({
        data: {
          areaAssId: visit.areaAssId,
          id: visit._id.toString(),
          locationId: visit.locationId,
          personId: visit.personId,
          responses: visit.responses,
          timestamp: visit.timestamp,
        },
      });
    }
  );
}
