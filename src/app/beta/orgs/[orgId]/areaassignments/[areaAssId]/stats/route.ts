import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson } from 'utils/types/zetkin';
import isPointInsidePolygon from 'features/canvass/utils/isPointInsidePolygon';
import {
  AreaAssignmentModel,
  LocationModel,
} from 'features/areaAssignments/models';
import {
  Household,
  Visit,
  ZetkinAreaAssignmentStats,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import { AreaModel } from 'features/areas/models';
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

      //Find all sessions of the assignment
      const assignmentModel = await AreaAssignmentModel.findOne({
        _id: params.areaAssId,
      });

      if (!assignmentModel) {
        return new NextResponse(null, { status: 404 });
      }

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
      const areas = sessions.map((session) => session.area);
      const uniqueAreas = [
        ...new Map(areas.map((area) => [area['id'], area])).values(),
      ];

      //Get all locations
      const allLocationModels = await LocationModel.find({ orgId });

      const allLocations: ZetkinLocation[] = allLocationModels.map((model) => ({
        description: model.description,
        households: model.households,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
      }));

      type LocationWithAreaId = ZetkinLocation & { areaId: ZetkinArea['id'] };

      //Find locations in the given areas
      const locationsInAreas: LocationWithAreaId[] = [];
      uniqueAreas.forEach((area) => {
        allLocations.forEach((location) => {
          const locationIsInArea = isPointInsidePolygon(
            { lat: location.position.lat, lng: location.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (locationIsInArea) {
            locationsInAreas.push({ ...location, areaId: area.id });
          }
        });
      });

      /**https://yagisanatode.com/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/ */
      const uniqueLocationsInAreas = [
        ...new Map(
          locationsInAreas.map((location) => [location['id'], location])
        ).values(),
      ];

      const visitsInAreas: Visit[] = [];
      const successfulVisitsInAreas: Visit[] = [];
      const visitedLocationsInAreas: string[] = [];
      const visitedAreas: string[] = [];
      const householdsInAreas: Household[] = [];

      const configuredMetrics = assignmentModel.metrics;
      const idOfMetricThatDefinesDone = configuredMetrics.find(
        (metric) => metric.definesDone
      )?._id;
      const accumulatedMetrics: ZetkinAreaAssignmentStats['metrics'] =
        configuredMetrics.map((metric) => ({
          metric: {
            definesDone: metric.definesDone,
            description: metric.description,
            id: metric._id,
            kind: metric.kind,
            question: metric.question,
          },
          values: metric.kind == 'boolean' ? [0, 0] : [0, 0, 0, 0, 0],
        }));

      allLocations.forEach((location) => {
        location.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.areaAssId == params.areaAssId) {
              visit.responses.forEach((response) => {
                const configuredMetric = configuredMetrics.find(
                  (candidate) => candidate._id == response.metricId
                );

                const accumulatedMetric = accumulatedMetrics.find(
                  (accum) => accum.metric.id == response.metricId
                );

                if (accumulatedMetric && configuredMetric) {
                  if (configuredMetric.kind === 'boolean') {
                    if (response.response === 'yes') {
                      accumulatedMetric.values[0]++;
                    } else if (response.response === 'no') {
                      accumulatedMetric.values[1]++;
                    }
                  } else if (configuredMetric.kind === 'scale5') {
                    const rating = parseInt(response.response);
                    const index = rating - 1;
                    accumulatedMetric.values[index]++;
                  }
                }
              });
            }
          });
        });
      });

      uniqueLocationsInAreas.forEach((location) => {
        householdsInAreas.push(...location.households);
        location.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.areaAssId == params.areaAssId) {
              visitedAreas.push(location.areaId);
              visitedLocationsInAreas.push(location.id);
              visitsInAreas.push(visit);

              visit.responses.forEach((response) => {
                if (response.metricId == idOfMetricThatDefinesDone) {
                  if (response.response == 'yes') {
                    successfulVisitsInAreas.push(visit);
                  }
                }
              });
            }
          });
        });
      });

      //Find locations outside the areas that have visits in this assignment
      const idsOfLocationsInAreas = new Set(
        locationsInAreas.map((location) => location.id)
      );
      const locationsOutsideAreas = allLocations.filter(
        (location) => !idsOfLocationsInAreas.has(location.id)
      );

      const visitsOutsideAreas: Visit[] = [];
      const visitedLocationsOutsideAreas: string[] = [];
      locationsOutsideAreas.forEach((location) => {
        location.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.areaAssId == params.areaAssId) {
              visitedLocationsOutsideAreas.push(location.id);
              visitsOutsideAreas.push(visit);
            }
          });
        });
      });

      return Response.json({
        data: {
          metrics: accumulatedMetrics,
          num_areas: uniqueAreas.length,
          num_households: householdsInAreas.length,
          num_locations: uniqueLocationsInAreas.length,
          num_successful_visited_households: successfulVisitsInAreas.length,
          num_visited_areas: Array.from(new Set(visitedAreas)).length,
          num_visited_households: visitsInAreas.length,
          num_visited_households_outside_areas: visitsOutsideAreas.length,
          num_visited_locations: Array.from(new Set(visitedLocationsInAreas))
            .length,
          num_visited_locations_outside_areas: Array.from(
            new Set(visitedLocationsOutsideAreas)
          ).length,
        },
      });
    }
  );
}
