import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson } from 'utils/types/zetkin';
import isPointInsidePolygon from 'features/canvassAssignments/utils/isPointInsidePolygon';
import {
  CanvassAssignmentModel,
  PlaceModel,
} from 'features/canvassAssignments/models';
import {
  Household,
  Visit,
  ZetkinCanvassAssignmentStats,
  ZetkinCanvassSession,
  ZetkinPlace,
} from 'features/canvassAssignments/types';
import { AreaModel } from 'features/areas/models';
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

      //Find all sessions of the assignment
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
              tags: [], //TODO: Is this really neccessary here?
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

      type PlaceWithAreaId = ZetkinPlace & { areaId: ZetkinArea['id'] };

      //Find places in the given areas
      const placesInAreas: PlaceWithAreaId[] = [];
      uniqueAreas.forEach((area) => {
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            placesInAreas.push({ ...place, areaId: area.id });
          }
        });
      });

      /**https://yagisanatode.com/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/ */
      const uniquePlacesInAreas = [
        ...new Map(placesInAreas.map((place) => [place['id'], place])).values(),
      ];

      const visitsInAreas: Visit[] = [];
      const successfulVisitsInAreas: Visit[] = [];
      const visitedPlacesInAreas: string[] = [];
      const visitedAreas: string[] = [];
      const householdsInAreas: Household[] = [];

      const configuredMetrics = model.metrics;
      const idOfMetricThatDefinesDone = configuredMetrics.find(
        (metric) => metric.definesDone
      )?._id;
      const accumulatedMetrics: ZetkinCanvassAssignmentStats['metrics'] =
        configuredMetrics.map((metric) => ({
          metric: {
            _id: metric._id,
            definesDone: metric.definesDone,
            description: metric.description,
            kind: metric.kind,
            question: metric.question,
          },
          values: metric.kind == 'boolean' ? [0] : [0, 0, 0, 0, 0],
        }));

      allPlaces.forEach((place) => {
        place.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.canvassAssId == params.canvassAssId) {
              visit.responses.forEach((response) => {
                const configuredMetric = configuredMetrics.find(
                  (candidate) => candidate._id == response.metricId
                );

                const accumulatedMetric = accumulatedMetrics.find(
                  (accum) => accum.metric._id == response.metricId
                );

                if (accumulatedMetric && configuredMetric) {
                  if (response.response == 'yes') {
                    accumulatedMetric.values[0]++;
                  } else if (configuredMetric.kind == 'scale5') {
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

      uniquePlacesInAreas.forEach((place) => {
        householdsInAreas.push(...place.households);
        place.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.canvassAssId == params.canvassAssId) {
              visitedAreas.push(place.areaId);
              visitedPlacesInAreas.push(place.id);
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

      //Find places outside the areas that have visits in this assignment
      const idsOfPlacesInAreas = new Set(
        placesInAreas.map((place) => place.id)
      );
      const placesOutsideAreas = allPlaces.filter(
        (place) => !idsOfPlacesInAreas.has(place.id)
      );

      const visitsOutsideAreas: Visit[] = [];
      const visitedPlacesOutsideAreas: string[] = [];
      placesOutsideAreas.forEach((place) => {
        place.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.canvassAssId == params.canvassAssId) {
              visitedPlacesOutsideAreas.push(place.id);
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
          num_places: uniquePlacesInAreas.length,
          num_successful_visited_households: successfulVisitsInAreas.length,
          num_visited_areas: Array.from(new Set(visitedAreas)).length,
          num_visited_households: visitsInAreas.length,
          num_visited_households_outside_areas: visitsOutsideAreas.length,
          num_visited_places: Array.from(new Set(visitedPlacesInAreas)).length,
          num_visited_places_outside_areas: Array.from(
            new Set(visitedPlacesOutsideAreas)
          ).length,
        },
      });
    }
  );
}
