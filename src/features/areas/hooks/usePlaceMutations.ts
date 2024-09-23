import { useApiClient, useAppDispatch } from 'core/hooks';
import { Household, Visit, ZetkinPlace, ZetkinPlacePatchBody } from '../types';
import { placeUpdated } from '../store';

export default function usePlaceMutations(orgId: number, placeId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    addHousehold: async (data: { title: Household['title'] }) => {
      const place = await apiClient.post<ZetkinPlace>(
        `/beta/orgs/${orgId}/places/${placeId}/households`,
        data
      );
      dispatch(placeUpdated(place));
    },
    addVisit: async (householdId: string, data: Omit<Visit, 'id'>) => {
      const place = await apiClient.post<ZetkinPlace, Omit<Visit, 'id'>>(
        `/beta/orgs/${orgId}/places/${placeId}/households/${householdId}/visits`,
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
