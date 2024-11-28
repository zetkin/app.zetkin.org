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
import { ZetkinPerson, ZetkinTag } from 'utils/types/zetkin';
import { ZetkinArea } from 'features/areas/types';

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

      //Get all areas
      const allAreaModels = await AreaModel.find({ orgId });

      //Get all places
      const allPlaceModels = await PlaceModel.find({ orgId });

      //Get the assignment
      const assignmentModel = await CanvassAssignmentModel.findOne({
        _id: params.canvassAssId,
      });

      if (!assignmentModel || !allPlaceModels || !allAreaModels) {
        return new NextResponse(null, { status: 404 });
      }

      //Find all sessions of the assignment
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
              end_date: assignmentModel.end_date,
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
              start_date: assignmentModel.start_date,
              title: assignmentModel.title,
            },
          });
        }
      }

      //Areas that are parts of the sessions
      const areasWithAssignees = sessions.map((session) => session.area);

      //Find areas with visits that are not part of the sessions
      const allTags = await apiClient.get<ZetkinTag[]>(
        `/api/orgs/${orgId}/people/tags`
      );

      const allPlaces: ZetkinPlace[] = allPlaceModels.map((model) => ({
        description: model.description,
        households: model.households,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
      }));

      const allAreas: ZetkinArea[] = allAreaModels.map((model) => {
        const tags: ZetkinTag[] = [];
        (model.tags || []).forEach((item) => {
          const tag = allTags.find((tag) => tag.id == item.id);
          if (tag) {
            tags.push({
              ...tag,
              value: item.value,
            });
          }
        });
        return {
          description: model.description,
          id: model._id.toString(),
          organization: {
            id: model.orgId,
          },
          points: model.points,
          tags: tags,
          title: model.title,
        };
      });

      const areasWithoutAssignees = allAreas.filter(
        (area) => !areasWithAssignees.includes(area)
      );

      const areasWithVisitsButNoAssignees: ZetkinArea[] = [];

      areasWithoutAssignees.forEach((area) => {
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            let placeHasVisits = false;
            place.households.forEach((household) => {
              const hasVisitInThisAssignment = household.visits.find(
                (visit) => visit.canvassAssId == params.canvassAssId
              );

              if (hasVisitInThisAssignment && !placeHasVisits) {
                placeHasVisits = true;
              }
            });

            if (placeHasVisits) {
              areasWithVisitsButNoAssignees.push(area);
            }
          }
        });
      });

      //Make one array of areas with assignees,
      // and areas without assignees that have
      //visits in this assignment
      const uniqueAreas = [
        ...new Map(
          areasWithAssignees.map((area) => [area['id'], area])
        ).values(),
        ...new Map(
          areasWithVisitsButNoAssignees.map((area) => [area['id'], area])
        ).values(),
      ];

      const statsByAreaId: Record<string, ZetkinAssignmentAreaStatsItem> = {};

      uniqueAreas.forEach((area) => {
        statsByAreaId[area.id] = {
          areaId: area.id,
          num_households: 0,
          num_places: 0,
          num_successful_visited_households: 0,
          num_visited_households: 0,
          num_visited_places: 0,
        };
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          const configuredMetrics = assignmentModel.metrics;
          const idOfMetricThatDefinesDone = configuredMetrics.find(
            (metric) => metric.definesDone
          )?._id;

          if (placeIsInArea) {
            statsByAreaId[area.id].num_places++;
            statsByAreaId[area.id].num_households += place.households.length;

            let placeVisited = false;

            place.households.forEach((household) => {
              const hasVisitInThisAssignment = household.visits.find(
                (visit) => visit.canvassAssId == params.canvassAssId
              );

              if (hasVisitInThisAssignment) {
                statsByAreaId[area.id].num_visited_households++;

                if (!placeVisited) {
                  statsByAreaId[area.id].num_visited_places++;
                  placeVisited = true;
                }
              }

              household.visits.forEach((visit) => {
                if (visit.canvassAssId == params.canvassAssId) {
                  visit.responses.forEach((response) => {
                    if (response.metricId == idOfMetricThatDefinesDone) {
                      if (response.response == 'yes') {
                        statsByAreaId[area.id]
                          .num_successful_visited_households++;
                      }
                    }
                  });
                }
              });
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
