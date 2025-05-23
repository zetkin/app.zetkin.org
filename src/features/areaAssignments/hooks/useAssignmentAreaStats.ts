import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { areaStatsLoad, areaStatsLoaded } from '../store';

export default function useAssignmentAreaStats(
  orgId: number,
  areaAssId: number
) {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.areaAssignments.areaStatsByAssignmentId[areaAssId]
  );

  return loadItemIfNecessary(stats, dispatch, {
    actionOnLoad: () => areaStatsLoad(areaAssId),
    actionOnSuccess: (data) => areaStatsLoaded([areaAssId, data]),
    loader: async () => ({
      // TODO: Get this from API once implemented
      id: 0,
      stats: [],
    }),
  });
}
