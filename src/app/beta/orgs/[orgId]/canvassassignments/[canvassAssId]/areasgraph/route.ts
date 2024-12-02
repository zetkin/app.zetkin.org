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
              reporting_level: assignmentModel.reporting_level || 'household',
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

      const metricThatDefinesDone = assignmentModel.metrics
        .find((metric) => metric.definesDone)
        ?._id.toString();

      const filteredVisitsInAllAreas: Visit[] = [];
      let firstVisit: Date = new Date();
      let lastVisit: Date = new Date();

      allPlaces.forEach((place) => {
        const placeVisits = place.households
          .flatMap((household) => household.visits)
          .filter((visit) => visit.canvassAssId === params.canvassAssId);

        filteredVisitsInAllAreas.push(...placeVisits);
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
      const householdsOutsideAreasList: Household[] = [];

      uniqueAreas.forEach((area) => {
        if (!areaData[area.id]) {
          areaData[area.id] = {
            area: { id: area.id, title: area.title },
            data: [],
          };
        }

        const areaVisitsData: AreaGraphData[] = [];
        const householdList: Household[] = [];

        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            const filteredHouseholds = place.households.filter((household) => {
              return household.visits.filter(
                (visit) => visit.canvassAssId === params.canvassAssId
              );
            });
            householdList.push(...filteredHouseholds);
          }
        });

        const visitsData = getAreaData(
          lastVisit,
          householdList,
          firstVisit,
          metricThatDefinesDone || ''
        );
        areaVisitsData.push(...visitsData);

        areaData[area.id].data.push(...areaVisitsData);

        if (!addedAreaIds.has(area.id)) {
          areasDataList.push(areaData[area.id]);
          addedAreaIds.add(area.id);
        }
      });

      //rogue visits logic
      const idsOfPlacesInAreas = new Set(
        placesInAreas.map((place) => place.id)
      );
      const placesOutsideAreas = allPlaces.filter(
        (place) => !idsOfPlacesInAreas.has(place.id)
      );

      placesOutsideAreas.forEach((place) => {
        place.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.canvassAssId == params.canvassAssId) {
              householdsOutsideAreasList.push(household);
            }
          });
        });
      });

      if (householdsOutsideAreasList.length > 0) {
        const visitsData = getAreaData(
          lastVisit,
          householdsOutsideAreasList,
          firstVisit,
          metricThatDefinesDone || ''
        );
        const noAreaData = (areaData['noArea'] = {
          area: { id: 'noArea', title: 'noArea' },
          data: visitsData,
        });

        areasDataList.push(noAreaData);
      }

      const areasDataArray: AreaCardData[] = Object.values(areasDataList);

      return NextResponse.json({
        data: areasDataArray,
      });
    }
  );
}
