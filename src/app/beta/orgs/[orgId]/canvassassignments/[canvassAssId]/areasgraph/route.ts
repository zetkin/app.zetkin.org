import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { AreaModel } from 'features/areas/models';
import {
  CanvassAssignmentModel,
  PlaceModel,
} from 'features/canvassAssignments/models';
import {
  AreaCardData,
  AreaGraphData,
  Household,
  Visit,
  ZetkinCanvassSession,
  ZetkinPlace,
} from 'features/canvassAssignments/types';
import getAreaData from 'features/canvassAssignments/utils/getAreaData';
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

      const metricThatDefinesDone = assignmentModel.metrics.find(
        (metric) => metric.definesDone
      )?._id;

      const filteredVisitsInAllAreas: Visit[] = [];
      let firstVisit: Date;
      let lastVisit: Date;

      uniqueAreas.forEach((area) => {
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            // Extract all visits from households in this place that belong to the canvass assignment
            const placeVisits = place.households
              .flatMap((household) => household.visits)
              .filter((visit) => visit.canvassAssId === params.canvassAssId);

            filteredVisitsInAllAreas.push(...placeVisits);
          }
        });
      });

      if (filteredVisitsInAllAreas.length > 0) {
        // Sort filtered visits by timestamp
        const sortedVisits = filteredVisitsInAllAreas.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        firstVisit = new Date(sortedVisits[0].timestamp);
        lastVisit = new Date(sortedVisits[sortedVisits.length - 1].timestamp);
      }

      const areaData: Record<
        string,
        { area: { id: string; title: string | null }; data: AreaGraphData[] }
      > = {};

      const areasDataList: AreaCardData[] = [];

      const addedAreaIds = new Set<string>();
      let householdList: Household[] = [];

      uniqueAreas.forEach((area) => {
        if (!areaData[area.id]) {
          areaData[area.id] = {
            area: { id: area.id, title: area.title },
            data: [],
          };
        }
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            householdList = place.households.filter((household) => {
              return household.visits.some(
                (visit) => visit.canvassAssId === params.canvassAssId
              );
            });
          }
        });
        const areaVisitsData = getAreaData(
          lastVisit,
          householdList,
          firstVisit,
          metricThatDefinesDone || ''
        );

        areaData[area.id].data.push(...areaVisitsData);

        if (!addedAreaIds.has(area.id)) {
          areasDataList.push(areaData[area.id]);
          addedAreaIds.add(area.id);
        }
      });

      const areasDataArray: AreaCardData[] = Object.values(areasDataList);

      return NextResponse.json({
        data: areasDataArray,
      });
    }
  );
}
