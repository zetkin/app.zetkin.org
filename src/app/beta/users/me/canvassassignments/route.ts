import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { CanvassAssignmentModel } from 'features/canvassAssignments/models';
import { ZetkinCanvassSession } from 'features/canvassAssignments/types';
import { ZetkinMembership, ZetkinPerson } from 'utils/types/zetkin';
import { AreaModel } from 'features/areas/models';

export async function GET(request: NextRequest) {
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  await mongoose.connect(process.env.MONGODB_URL || '');
  const memberships = await apiClient.get<ZetkinMembership[]>(
    `/api/users/me/memberships`
  );

  const sessions: ZetkinCanvassSession[] = [];

  for await (const membership of memberships) {
    const { id: personId } = membership.profile;

    const person = await apiClient.get<ZetkinPerson>(
      `/api/orgs/${membership.organization.id}/people/${personId}`
    );

    const assignmentModels = await CanvassAssignmentModel.find({
      orgId: membership.organization.id,
      'sessions.personId': { $eq: personId },
    });

    for await (const assignment of assignmentModels) {
      for await (const sessionData of assignment.sessions) {
        if (sessionData.personId == personId) {
          const orgId = assignment.orgId;

          const area = await AreaModel.findOne({
            _id: sessionData.areaId,
          });

          if (area) {
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
                id: assignment._id.toString(),
                title: assignment.title,
              },
            });
          }
        }
      }
    }
  }

  return NextResponse.json({
    data: sessions,
  });
}
