import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { CanvassAssignmentModel } from 'features/canvassAssignments/models';
import { ZetkinCanvassSession } from 'features/canvassAssignments/types';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson } from 'utils/types/zetkin';
import { AreaModel } from 'features/areas/models';

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
      roles: ['admin'],
    },
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const model = await CanvassAssignmentModel.findOne({
        _id: params.canvassAssId,
      });

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      const sessions: ZetkinCanvassSession[] = [];

      for await (const sessionData of model.sessions) {
        const person = await apiClient.get<ZetkinPerson>(
          `/api/orgs/${orgId}/people/${sessionData.personId}`
        );
        const area = await AreaModel.findOne({
          _id: sessionData.areaId,
        });

        if (area && person) {
          sessions.push({
            area: {
              description: area.description,
              id: area._id.toString(),
              organization: {
                id: orgId,
              },
              points: area.points,
              tags: [], // TODO: is this necessary here?
              title: area.title,
            },
            assignee: person,
            assignment: {
              id: model._id.toString(),
              title: model.title,
            },
          });
        }
      }

      return NextResponse.json({
        data: sessions,
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
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const assignment = await CanvassAssignmentModel.findOne({
        _id: params.canvassAssId,
      });

      if (!assignment) {
        return new NextResponse(null, { status: 404 });
      }

      const payload = await request.json();
      const sessionData = {
        areaId: payload.areaId as string,
        personId: payload.personId as number,
      };

      const person = await apiClient.get<ZetkinPerson>(
        `/api/orgs/${orgId}/people/${sessionData.personId}`
      );

      const area = await AreaModel.findOne({
        _id: sessionData.areaId,
      });

      if (area && person) {
        assignment.sessions.push(sessionData);

        await assignment.save();

        return NextResponse.json({
          data: {
            area: {
              description: area.description,
              id: area._id.toString(),
              organization: {
                id: orgId,
              },
              points: area.points,
              title: area.title,
            },
            assignee: person,
            assignment: {
              id: assignment._id.toString(),
              title: assignment.title,
            },
          },
        });
      } else {
        return new NextResponse(null, { status: 404 });
      }
    }
  );
}
