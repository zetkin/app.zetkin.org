import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import {
  CanvassAssignmentModel,
  PlaceModel,
} from 'features/canvassAssignments/models';
import {
  ZetkinAssignmentAreaStatsItem,
  ZetkinCanvassSession,
  ZetkinPlace,
} from 'features/canvassAssignments/types';
import isPointInsidePolygon from 'features/canvassAssignments/utils/isPointInsidePolygon';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson } from 'utils/types/zetkin';

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
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      //Find all sessions of the assignment
      const assignmentModel = await CanvassAssignmentModel.findOne({
        _id: params.canvassAssId,
      });

      if (!assignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

      const sessions: ZetkinCanvassSession[] = [];

      for await (const sessionData of assignmentModel.sessions) {
        const person = await apiClient.get<ZetkinPerson>(
          `/api/orgs/${orgId}/people/${sessionData.personId}`
        );
        const areaModel = await AreaModel.findOne({
          _id: sessionData.areaId,
        });

        if (areaModel && person) {
          sessions.push({
            area: {
              description: areaModel.description,
              id: areaModel._id.toString(),
              organization: {
                id: orgId,
              },
              points: areaModel.points,
              tags: [], //TODO: Is this really neccessary here?
              title: areaModel.title,
            },
            assignee: person,
            assignment: {
              campaign: {
                id: assignmentModel.campId,
              },
              id: assignmentModel._id.toString(),
              metrics: assignmentModel.metrics.map((m) => ({
                definesDone: m.definesDone,
                description: m.description,
                id: m._id,
                kind: m.kind,
                question: m.question,
              })),
              organization: {
                id: assignmentModel.orgId,
              },
              title: assignmentModel.title,
            },
          });
        }
      }

      //Areas that are parts of the sessions
      const areas = sessions.map((session) => session.area);
      const uniqueAreas = [
        ...new Map(areas.map((area) => [area['id'], area])).values(),
      ];

      //Get all places
      const allPlaceModels = await PlaceModel.find({ orgId });

      const allPlaces: ZetkinPlace[] = allPlaceModels.map((model) => ({
        description: model.description,
        households: model.households,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
      }));

      const statsByAreaId: Record<string, ZetkinAssignmentAreaStatsItem> = {};

      uniqueAreas.forEach((area) => {
        statsByAreaId[area.id] = {
          areaId: area.id,
          num_households: 0,
          num_visits: 0,
        };
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            statsByAreaId[area.id].num_households += place.households.length;

            place.households.forEach((household) => {
              const hasVisitInThisAssignment = household.visits.find(
                (visit) => visit.canvassAssId == params.canvassAssId
              );

              if (hasVisitInThisAssignment) {
                statsByAreaId[area.id].num_visits++;
              }
            });
          }
        });
      });

      return Response.json({
        data: {
          stats: Object.values(statsByAreaId),
        },
      });
    }
  );
}
