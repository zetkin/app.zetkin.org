import { useState } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  HouseholdPatchBody,
  Visit,
  ZetkinLocation,
  ZetkinLocationPatchBody,
  ZetkinLocationVisit,
  ZetkinLocationVisitPostBody,
} from '../types';
import { locationUpdated, visitCreated } from '../store';
import createHouseholds from '../rpc/createHouseholds/client';

export default function useLocationMutations(
  orgId: number,
  locationId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const [isAddVisitLoading, setIsAddVisitLoading] = useState<boolean>(false);

  return {
    addHousehold: async () => {
      const location = await apiClient.post<ZetkinLocation>(
        `/beta/orgs/${orgId}/locations/${locationId}/households`,
        {}
      );
      dispatch(locationUpdated(location));
      return location.households[0];
    },
    addHouseholds: async (households: { floor: number; title: string }[]) => {
      const location = await apiClient.rpc(createHouseholds, {
        households,
        locationId,
        orgId,
      });
      dispatch(locationUpdated(location));
    },
    addVisit: async (
      householdId: string,
      data: Omit<Visit, 'id' | 'personId'>
    ) => {
      setIsAddVisitLoading(true);
      const location = await apiClient.post<
        ZetkinLocation,
        Omit<Visit, 'id' | 'personId'>
      >(
        `/beta/orgs/${orgId}/locations/${locationId}/households/${householdId}/visits`,
        data
      );
      dispatch(locationUpdated(location));
      setIsAddVisitLoading(false);
    },
    isAddVisitLoading,
    reportLocationVisit: async (
      areaAssId: string,
      data: ZetkinLocationVisitPostBody
    ) => {
      const visit = await apiClient.post<
        ZetkinLocationVisit,
        ZetkinLocationVisitPostBody
      >(`/beta/orgs/${orgId}/areaassignments/${areaAssId}/visits`, data);
      dispatch(visitCreated(visit));
    },
    updateHousehold: async (householdId: string, data: HouseholdPatchBody) => {
      const location = await apiClient.patch<
        ZetkinLocation,
        HouseholdPatchBody
      >(
        `/beta/orgs/${orgId}/locations/${locationId}/households/${householdId}`,
        data
      );
      dispatch(locationUpdated(location));
    },
    updateLocation: async (data: ZetkinLocationPatchBody) => {
      const location = await apiClient.patch<
        ZetkinLocation,
        ZetkinLocationPatchBody
      >(`/beta/orgs/${orgId}/locations/${locationId}`, data);
      dispatch(locationUpdated(location));
    },
  };
}
