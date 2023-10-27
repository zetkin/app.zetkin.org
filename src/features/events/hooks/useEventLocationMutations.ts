import { ZetkinLocation } from 'utils/types/zetkin';
import { locationAdded, locationUpdate, locationUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type ZetkinLocationPatchBody = Partial<Omit<ZetkinLocation, 'id'>>;

type useEventLocationMutationsReturn = {
  addLocation: (newLocation: Partial<ZetkinLocation>) => void;
  setLocationDescription: (locationId: number, description: string) => void;
  setLocationLatLng: (locationId: number, lat: number, lng: number) => void;
  setLocationTitle: (locationId: number, title: string) => void;
};

export default function useEventLocationMutations(
  orgId: number
): useEventLocationMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const addLocation = async (newLocation: Partial<ZetkinLocation>) => {
    const location = await apiClient.post<ZetkinLocation>(
      `/api/orgs/${orgId}/locations`,
      {
        info_text: newLocation.info_text,
        lat: newLocation.lat,
        lng: newLocation.lng,
        title: newLocation.title,
      }
    );
    dispatch(locationAdded(location));
  };

  const setLocationDescription = (locationId: number, description: string) => {
    updateLocation(orgId, locationId, {
      info_text: description,
    });
  };

  const setLocationLatLng = (locationId: number, lat: number, lng: number) => {
    updateLocation(orgId, locationId, { lat, lng });
  };

  const setLocationTitle = (locationId: number, title: string) => {
    updateLocation(orgId, locationId, { title });
  };

  const updateLocation = (
    orgId: number,
    locationId: number,
    data: ZetkinLocationPatchBody
  ) => {
    dispatch(locationUpdate([locationId, Object.keys(data)]));
    apiClient
      .patch<ZetkinLocation>(`/api/orgs/${orgId}/locations/${locationId}`, data)
      .then((location) => {
        dispatch(locationUpdated(location));
      });
  };

  return {
    addLocation,
    setLocationDescription,
    setLocationLatLng,
    setLocationTitle,
  };
}
