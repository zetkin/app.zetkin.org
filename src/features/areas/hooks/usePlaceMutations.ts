import { useState } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  HouseholdPatchBody,
  Rating,
  Visit,
  ZetkinPlace,
  ZetkinPlacePatchBody,
} from '../types';
import { placeUpdated } from '../store';

export default function usePlaceMutations(orgId: number, placeId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const [isAddVisitLoading, setIsAddVisitLoading] = useState<boolean>(false);
  const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);

  return {
    addHousehold: async () => {
      const place = await apiClient.post<ZetkinPlace>(
        `/beta/orgs/${orgId}/places/${placeId}/households`,
        {}
      );
      dispatch(placeUpdated(place));
      return place.households[0];
    },
    addRating: async (householdId: string, data: Omit<Rating, 'id'>) => {
      setIsRatingLoading(true);
      const place = await apiClient.post<ZetkinPlace, Omit<Rating, 'id'>>(
        `/beta/orgs/${orgId}/places/${placeId}/households/${householdId}/ratings`,
        data
      );
      dispatch(placeUpdated(place));
      setIsRatingLoading(false);
    },
    addVisit: async (householdId: string, data: Omit<Visit, 'id'>) => {
      setIsAddVisitLoading(true);
      const place = await apiClient.post<ZetkinPlace, Omit<Visit, 'id'>>(
        `/beta/orgs/${orgId}/places/${placeId}/households/${householdId}/visits`,
        data
      );
      dispatch(placeUpdated(place));
      setIsAddVisitLoading(false);
    },
    isAddVisitLoading,
    isRatingLoading,
    updateHousehold: async (householdId: string, data: HouseholdPatchBody) => {
      const place = await apiClient.patch<ZetkinPlace, HouseholdPatchBody>(
        `/beta/orgs/${orgId}/places/${placeId}/households/${householdId}`,
        data
      );
      dispatch(placeUpdated(place));
    },
    updatePlace: async (data: ZetkinPlacePatchBody) => {
      const place = await apiClient.patch<ZetkinPlace, ZetkinPlacePatchBody>(
        `/beta/orgs/${orgId}/places/${placeId}`,
        data
      );
      dispatch(placeUpdated(place));
    },
  };
}
