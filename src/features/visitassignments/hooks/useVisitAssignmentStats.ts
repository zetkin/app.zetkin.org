import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinVisitAssignmentStats } from '../types';
import { statsLoad, statsLoaded } from '../store';

export default function useVisitAssignmentStats(
  orgId: number,
  visitAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.visitAssignments.statsByVisitAssId[visitAssId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(visitAssId),
    actionOnSuccess: (data) => statsLoaded([visitAssId, data]),
    loader: () =>
      apiClient.get<ZetkinVisitAssignmentStats>(
        `/beta/orgs/${orgId}/visitassignments/${visitAssId}/stats`
      ),
  });
}
