import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCanvassAssignmentStats } from '../types';
import { statsLoad, statsLoaded } from '../store';

export default function useCanvassAssignmentStats(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.areas.statsByCanvassAssId[canvassAssId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(canvassAssId),
    actionOnSuccess: (data) => statsLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<ZetkinCanvassAssignmentStats>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/stats`
      ),
  });
}
