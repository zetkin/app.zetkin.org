import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinLocation } from '../types';
import { locationsLoad, locationsLoaded } from '../store';
import { loadListIfNecessary } from 'core/caching/cacheUtils';

export default function useLocations(
  orgId: number,
  assignmentId: number,
  areaIds: number[] | number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  if (typeof areaIds == 'number') {
    areaIds = [areaIds];
  }
  const key = `${assignmentId}:${areaIds.join(',')}`;
  const locationList = useAppSelector(
    (state) => state.areaAssignments.locationsByAssignmentIdAndAreaId[key]
  );

  return loadListIfNecessary(locationList, dispatch, {
    actionOnLoad: () => locationsLoad(key),
    actionOnSuccess: (data) => locationsLoaded([key, data]),
    loader: () =>
      apiClient.get<ZetkinLocation[]>(
        `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations?within_areas=${areaIds.join(
          ','
        )}&buffer_meters=50&type=assignment`
      ),
  });
}
