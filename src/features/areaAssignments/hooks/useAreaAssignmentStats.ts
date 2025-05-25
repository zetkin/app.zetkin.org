import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignmentStats } from '../types';
import { statsLoad, statsLoaded } from '../store';

export default function useAreaAssignmentStats(
  orgId: number,
  areaAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.areaAssignments.statsByAreaAssId[areaAssId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(areaAssId),
    actionOnSuccess: (data) => statsLoaded([areaAssId, data]),
    loader: () =>
      apiClient.get<ZetkinAreaAssignmentStats>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/stats`
      ),
  });
}
