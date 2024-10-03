import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import {
  AreaModel,
  CanvassAssignmentModel,
  PlaceModel,
} from 'features/areas/models';
import {
  Household,
  Visit,
  ZetkinCanvassSession,
  ZetkinPlace,
} from 'features/areas/types';
import asOrgAuthorized from 'utils/api/asOrgAuthorized';
import { ZetkinPerson } from 'utils/types/zetkin';
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

      //Get all places
      const placeModels = await PlaceModel.find({ orgId });
      const places: ZetkinPlace[] = placeModels.map((model) => ({
        description: model.description,
        households: model.households,
        id: model._id.toString(),
        orgId: orgId,
        position: model.position,
        title: model.title,
        type: model.type,
      }));

      //Find places in the given areas
      const placesInAreas: ZetkinPlace[] = [];
      areas.forEach((area) => {
        places.forEach((place) => {
          const placeIsInArea = isPointInsidePolygon(
            { lat: place.position.lat, lng: place.position.lng },
            area.points.map((point) => ({ lat: point[0], lng: point[1] }))
          );

          if (placeIsInArea) {
            placesInAreas.push(place);
          }
        });
      });

      const uniquePlaces = Array.from(new Set(placesInAreas));

      const households: Household[] = [];
      uniquePlaces.forEach((place) => households.push(...place.households));

      const visits: Visit[] = [];
      const visitedPlaces: ZetkinPlace[] = [];
      uniquePlaces.forEach((place) => {
        place.households.forEach((household) => {
          household.visits.forEach((visit) => {
            if (visit.canvassAssId == params.canvassAssId) {
              visitedPlaces.push(place);
              visits.push(visit);
            }
          });
        });
      });

      return Response.json({
        data: {
          numHouseholds: households.length,
          numPlaces: uniquePlaces.length,
          numVisitedHouseholds: visits.length,
          numVisitedPlaces: visitedPlaces.length,
        },
      });
    }
  );
}
