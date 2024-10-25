import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import {
  CanvassAssignmentModel,
  PlaceModel,
} from 'features/canvassAssignments/models';
import {
  GraphData,
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

      // Find the canvass assignment model
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
        const areaModel = await AreaModel.findOne({ _id: sessionData.areaId });

        if (areaModel && person) {
          sessions.push({
            area: {
              description: areaModel.description,
              id: areaModel._id.toString(),
              organization: { id: orgId },
              points: areaModel.points,
              tags: [],
              title: areaModel.title,
            },
            assignee: person,
            assignment: {
              campaign: { id: assignmentModel.campId },
              end_date: assignmentModel.end_date,
              id: assignmentModel._id.toString(),
              metrics: assignmentModel.metrics.map((m) => ({
                definesDone: m.definesDone,
                description: m.description,
                id: m._id,
                kind: m.kind,
                question: m.question,
              })),
              organization: { id: assignmentModel.orgId },
              start_date: assignmentModel.start_date,
              title: assignmentModel.title,
            },
          });
        }
      }

      const areas = sessions.map((session) => session.area);
      const uniqueAreas = [
        ...new Map(areas.map((area) => [area.id, area])).values(),
      ];

      const allPlaceModels = await PlaceModel.find({ orgId });
      const allPlaces: ZetkinPlace[] = allPlaceModels.map((model) => ({
        description: model.description,
        households: model.households,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
      }));

      const areasData: Record<string, GraphData> = {};

      const idOfMetricThatDefinesDone = assignmentModel.metrics.find(
        (metric) => metric.definesDone
      )?._id;

      uniqueAreas.forEach((area) => {
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            if (!areasData[area.id]) {
              areasData[area.id] = {
                areaId: area.id,
                householdsVisited: [],
                successfulVisits: [],
              };
            }

            const areaData = areasData[area.id];

            place.households.forEach((household) => {
              const hasVisitInThisAssignment = household.visits.find(
                (visit) => visit.canvassAssId == params.canvassAssId
              );

              //logic for households
              if (hasVisitInThisAssignment) {
                household.visits.forEach((visit) => {
                  if (visit.canvassAssId == params.canvassAssId) {
                    const date = new Date(visit.timestamp)
                      .toISOString()
                      .split('T')[0];
                    let householdsVisitedItem = areaData.householdsVisited.find(
                      (item) => item.date === date
                    );

                    if (!householdsVisitedItem) {
                      householdsVisitedItem = {
                        accumulatedVisits: 1,
                        date,
                      };
                      areaData.householdsVisited.push(householdsVisitedItem);
                    }
                    householdsVisitedItem.accumulatedVisits++;
                  }
                });
              }

              //logic for successful visits
              household.visits.forEach((visit) => {
                if (visit.canvassAssId == params.canvassAssId) {
                  visit.responses.forEach((response) => {
                    if (response.metricId == idOfMetricThatDefinesDone) {
                      if (response.response == 'yes') {
                        const date = new Date(visit.timestamp)
                          .toISOString()
                          .split('T')[0];
                        let successfulVisitsItem =
                          areaData.successfulVisits.find(
                            (item) => item.date === date
                          );

                        if (!successfulVisitsItem) {
                          successfulVisitsItem = {
                            accumulatedVisits: 1,
                            date,
                          };

                          areaData.successfulVisits.push(successfulVisitsItem);
                        }
                        successfulVisitsItem.accumulatedVisits++;
                      }
                    }
                  });
                }
              });
            });
          }
        });
      });

      const areasDataArray = Object.values(areasData);

      return NextResponse.json({
        data: areasDataArray,
      });
    }
  );
}
