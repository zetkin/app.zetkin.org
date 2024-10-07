import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import {
  AreaModel,
  CanvassAssignmentModel,
  PlaceModel,
} from 'features/areas/models';
import {
  ZetkinArea,
  ZetkinCanvassAssignmentAreaStats,
  ZetkinPlace,
} from 'features/areas/types';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import isPointInsidePolygon from 'features/areas/utils/isPointInsidePolygon';

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
    async ({ orgId }) => {
      await mongoose.connect(process.env.MONGODB_URL || '');

      const model = await CanvassAssignmentModel.findOne({
        _id: params.canvassAssId,
      });

      if (!model) {
        return new NextResponse(null, { status: 404 });
      }

      const areaList: ZetkinArea[] = [];

      for await (const sessionData of model.sessions) {
        const area = await AreaModel.findOne({
          _id: sessionData.areaId,
        });

        if (area) {
          areaList.push({
            description: area.description,
            id: area._id.toString(),
            organization: {
              id: orgId,
            },
            points: area.points,
            title: area.title,
          });
        }
      }

      const uniqueAreas = [
        ...new Map(areaList.map((area) => [area['id'], area])).values(),
      ];

      const allPlaceModels = await PlaceModel.find({ orgId });
      const allPlaces: ZetkinPlace[] = allPlaceModels.map((model) => ({
        description: model.description,
        households: model.households,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
        type: model.type,
      }));

      type PlacesWithAreaId = ZetkinPlace & { areaId: ZetkinArea['id'] };

      const placesInArea: PlacesWithAreaId[] = [];
      uniqueAreas.forEach((area) => {
        allPlaces.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            placesInArea.push({ ...place, areaId: area.id });
          }
        });
      });

      const uniquePlacesInArea = [
        ...new Map(placesInArea.map((place) => [place['id'], place])).values(),
      ];

      function calculateAreaStats(
        places: PlacesWithAreaId[],
        areas: ZetkinArea[],
        canvassAssId: string
      ): ZetkinCanvassAssignmentAreaStats[] {
        const results: ZetkinCanvassAssignmentAreaStats[] = [];

        // First, process the areas that have places
        places.forEach((place) => {
          const areaId = place.areaId;

          let areaStats = results.find((stat) => stat.id === areaId);

          if (!areaStats) {
            areaStats = {
              id: areaId,
              num_households: 0,
              num_places: 0,
              num_visited_households: 0,
              num_visited_places: 0,
            };
            results.push(areaStats);
          }

          areaStats.num_places += 1;

          const numHouseholdsInPlace = place.households.length;
          areaStats.num_households += numHouseholdsInPlace;

          let visitedHouseholdsCount = 0;
          let placeHasVisited = false;

          place.households.forEach((household) => {
            const hasVisited = household.visits.some(
              (visit) => visit.canvassAssId === canvassAssId
            );
            if (hasVisited) {
              visitedHouseholdsCount += 1;
              placeHasVisited = true;
            }
          });

          areaStats.num_visited_households += visitedHouseholdsCount;

          if (placeHasVisited) {
            areaStats.num_visited_places += 1;
          }
        });

        //Process areas without places
        areas.forEach((area) => {
          const areaHasPlace = results.some((stat) => stat.id === area.id);

          if (!areaHasPlace) {
            results.push({
              id: area.id,
              num_households: 0,
              num_places: 0,
              num_visited_households: 0,
              num_visited_places: 0,
            });
          }
        });

        return results;
      }

      const areasStats = calculateAreaStats(
        uniquePlacesInArea,
        uniqueAreas,
        params.canvassAssId
      );

      return Response.json({ data: areasStats });
    }
  );
}
