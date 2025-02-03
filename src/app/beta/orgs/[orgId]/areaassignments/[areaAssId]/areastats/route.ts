import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import {
  AreaAssignmentModel,
  LocationModel,
  LocationVisitModel,
  LocationVisitModelType,
} from 'features/areaAssignments/models';
import {
  ZetkinAssignmentAreaStatsItem,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import isPointInsidePolygon from 'features/canvass/utils/isPointInsidePolygon';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson, ZetkinTag } from 'utils/types/zetkin';
import { ZetkinArea } from 'features/areas/types';

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
    async ({ apiClient, orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      //Get all areas
      const allAreaModels = await AreaModel.find({ orgId });

      //Get all locations
      const allLocationModels = await LocationModel.find({ orgId });

      //Get the assignment
      const assignmentModel = await AreaAssignmentModel.findOne({
        _id: params.areaAssId,
      });

      if (!assignmentModel || !allLocationModels || !allAreaModels) {
        return new NextResponse(null, { status: 404 });
      }

      //Find all sessions of the assignment
      const sessions: ZetkinAreaAssignmentSession[] = [];

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
              instructions: assignmentModel.instructions,
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
              reporting_level: assignmentModel.reporting_level || 'household',
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

      const allLocations: ZetkinLocation[] = allLocationModels.map((model) => ({
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
        allLocations.forEach((location) => {
          const locationIsInArea = isPointInsidePolygon(
            { lat: location.position.lat, lng: location.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (locationIsInArea) {
            let locationHasVisits = false;
            location.households.forEach((household) => {
              const hasVisitInThisAssignment = household.visits.find(
                (visit) => visit.areaAssId == params.areaAssId
              );

              if (hasVisitInThisAssignment && !locationHasVisits) {
                locationHasVisits = true;
              }
            });

            if (locationHasVisits) {
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

      const allLocationVisits = await LocationVisitModel.find({
        areaAssId: params.areaAssId,
      });

      const visitsByLocationId: Record<string, LocationVisitModelType[]> = {};
      allLocationVisits.forEach((visit) => {
        if (!visitsByLocationId[visit.locationId]) {
          visitsByLocationId[visit.locationId] = [];
        }

        visitsByLocationId[visit.locationId].push(visit);
      });

      uniqueAreas.forEach((area) => {
        statsByAreaId[area.id] = {
          areaId: area.id,
          num_households: 0,
          num_locations: 0,
          num_successful_visited_households: 0,
          num_visited_households: 0,
          num_visited_locations: 0,
        };
        allLocations.forEach((location) => {
          const locationIsInArea = isPointInsidePolygon(
            { lat: location.position.lat, lng: location.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          const configuredMetrics = assignmentModel.metrics;
          const idOfMetricThatDefinesDone = configuredMetrics.find(
            (metric) => metric.definesDone
          )?._id;

          if (locationIsInArea) {
            statsByAreaId[area.id].num_locations++;
            statsByAreaId[area.id].num_households += location.households.length;

            let locationVisited = false;

            location.households.forEach((household) => {
              const hasVisitInThisAssignment = household.visits.find(
                (visit) => visit.areaAssId == params.areaAssId
              );

              if (hasVisitInThisAssignment) {
                statsByAreaId[area.id].num_visited_households++;

                if (!locationVisited) {
                  statsByAreaId[area.id].num_visited_locations++;
                  locationVisited = true;
                }
              }

              household.visits.forEach((visit) => {
                if (visit.areaAssId == params.areaAssId) {
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

            const locationVisits = visitsByLocationId[location.id] || [];
            locationVisits.forEach((visit) => {
              const numHouseholds = Math.max(
                ...visit.responses.map((response) =>
                  response.responseCounts.reduce((sum, count) => sum + count, 0)
                )
              );

              const successfulResponse = visit.responses.find(
                (response) => response.metricId == idOfMetricThatDefinesDone
              );
              const numSuccessful = successfulResponse?.responseCounts[0] || 0;

              statsByAreaId[area.id].num_successful_visited_households +=
                numSuccessful;
              statsByAreaId[area.id].num_visited_households += numHouseholds;
              statsByAreaId[area.id].num_visited_locations += 1;
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
