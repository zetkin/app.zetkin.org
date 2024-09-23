import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinPlace, ZetkinPlacePatchBody } from '../types';
import { placeUpdated } from '../store';

export default function usePlaceMutations(orgId: number, placeId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    addHousehold: async () => {
      const place = await apiClient.post<ZetkinPlace>(
        `/beta/orgs/${orgId}/places/${placeId}/households`,
        {}
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
