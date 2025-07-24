import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinLocation } from '../types';
import { locationsLoad, locationsLoaded } from '../store';
import { loadListIfNecessary } from 'core/caching/cacheUtils';

export default function useLocations(
  orgId: number,
  assignmentId: number,
  areaIds: number[]
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const locationList = useAppSelector(
    (state) => state.areaAssignments.locationsByAssignmentId[assignmentId]
  );

  const commaSeparatedAreaIds = areaIds.join(',');

  return loadListIfNecessary(locationList, dispatch, {
    actionOnLoad: () => locationsLoad(assignmentId),
    actionOnSuccess: (data) => locationsLoaded([assignmentId, data]),
    loader: () =>
      apiClient.get<ZetkinLocation[]>(
        `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations?within_areas=${commaSeparatedAreaIds}&buffer_meters=50`
      ),
  });
}
