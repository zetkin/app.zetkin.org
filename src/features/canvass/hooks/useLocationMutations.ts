import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  HouseholdPatchBody,
  Zetkin2Household,
  ZetkinLocationPatchBody,
} from '../types';
import { householdCreated, householdUpdated } from '../store';
import { locationUpdated } from '../../areaAssignments/store';
import createHouseholds from '../rpc/createHouseholds/client';
import { ZetkinLocation } from 'features/areaAssignments/types';

export default function useLocationMutations(
  orgId: number,
  locationId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    addHousehold: async (data: Partial<Zetkin2Household>) => {
      const household = await apiClient.post<Zetkin2Household>(
        `/api2/orgs/${orgId}/locations/${locationId}/households`,
        data
      );
      dispatch(householdCreated(household));
      return household;
    },
    addHouseholds: async (households: { level: number; title: string }[]) => {
      const created = await apiClient.rpc(createHouseholds, {
        households,
        locationId,
        orgId,
      });

      created.forEach((household) => dispatch(householdCreated(household)));
    },
    updateHousehold: async (householdId: number, data: HouseholdPatchBody) => {
      const household = await apiClient.patch<
        Zetkin2Household,
        HouseholdPatchBody
      >(
        `/api2/orgs/${orgId}/locations/${locationId}/households/${householdId}`,
        data
      );
      dispatch(householdUpdated([locationId, household]));
    },
    updateLocation: async (data: ZetkinLocationPatchBody) => {
      const location = await apiClient.patch<
        ZetkinLocation,
        ZetkinLocationPatchBody
      >(`/api2/orgs/${orgId}/locations/${locationId}`, data);
      dispatch(locationUpdated(location));
    },
  };
}
