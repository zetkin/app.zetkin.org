import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinLocation } from '../types';
import { locationLoad, locationLoaded } from '../store';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';

export default function useLocation(
  orgId: number,
  assignmentId: number,
  locationId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const locationItem = useAppSelector((state) =>
    state.areaAssignments.locationsByAssignmentId[assignmentId].items.find(
      (item) => item.id == locationId
    )
  );

  return loadItemIfNecessary(locationItem, dispatch, {
    actionOnLoad: () => locationLoad([assignmentId, locationId]),
    actionOnSuccess: (data) => locationLoaded([assignmentId, locationId, data]),
    loader: () =>
      apiClient.get<ZetkinLocation>(
        `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}`
      ),
  });
}
