import { IncomingHttpHeaders } from 'http';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { CanvassAssignmentModel } from 'features/canvassAssignments/models';
import { AssignmentWithAreas } from 'features/canvassAssignments/types';
import { ZetkinMembership } from 'utils/types/zetkin';
import { AreaModel } from 'features/areas/models';
import { ZetkinArea } from 'features/areas/types';

export async function GET(request: NextRequest) {
  const headers: IncomingHttpHeaders = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  const apiClient = new BackendApiClient(headers);

  await mongoose.connect(process.env.MONGODB_URL || '');
  const memberships = await apiClient.get<ZetkinMembership[]>(
    `/api/users/me/memberships`
  );

  const assignmentsWithAreas: AssignmentWithAreas[] = [];

  //för varje organisation personen är medlem i
  for await (const membership of memberships) {
    const { id: personId } = membership.profile;

    //plocka ut alla assignments som personen har en tilldelning i
    const assignmentModels = await CanvassAssignmentModel.find({
      orgId: membership.organization.id,
      'sessions.personId': { $eq: personId },
    });

    //för varje uppdrag personen har en tilldelning i
    for await (const assignment of assignmentModels) {
      const areas: ZetkinArea[] = [];

      //för varje session i det uppdraget
      for await (const session of assignment.sessions) {
        //om vi är på en session som "tillhör" personen
        if (session.personId == personId) {
          //lägg till arean i listan över areas
          const area = await AreaModel.findOne({
            _id: session.areaId,
          });

          if (area) {
            areas.push({
              description: area.description,
              id: area._id.toString(),
              organization: {
                id: area.orgId,
              },
              points: area.points,
              tags: [], // TODO: is this necessary here?
              title: area.title,
            });
          }
        }
      }

      assignmentsWithAreas.push({
        areas: areas,
        campaign: {
          id: assignment.campId,
        },
        id: assignment._id.toString(),
        metrics: assignment.metrics.map((m) => ({
          definesDone: m.definesDone,
          description: m.description,
          id: m._id.toString(),
          kind: m.kind,
          question: m.question,
        })),
        organization: {
          id: assignment.orgId,
        },
        title: assignment.title,
      });
    }

    /* for await (const assignment of assignmentModels) {
      for await (const sessionData of assignment.sessions) {
        if (sessionData.personId == personId) {
          const orgId = assignment.orgId;

          const area = await AreaModel.findOne({
            _id: sessionData.areaId,
          });

          if (area) {
            assignmentsWithAreas.push({
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
                campaign: {
                  id: assignment.campId,
                },
                id: assignment._id.toString(),
                metrics: assignment.metrics.map((m) => ({
                  definesDone: m.definesDone,
                  description: m.description,
                  id: m._id.toString(),
                  kind: m.kind,
                  question: m.question,
                })),
                organization: {
                  id: assignment.orgId,
                },
                title: assignment.title,
              },
            });
          }
        }
      }
    } */
  }

  return NextResponse.json({
    data: assignmentsWithAreas,
  });
}
