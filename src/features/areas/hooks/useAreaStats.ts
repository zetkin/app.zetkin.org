import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  assignmentStatsLoad,
  assignmentStatsLoaded,
} from 'features/areas/store';
import { ZetkinAreaStats } from '../types';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { futureToObject } from 'core/caching/futures';

export default function useAreaStats() {
  const dispatch = useAppDispatch();
  const allAreaStats = useAppSelector(
    (state) => state.areas.assignmentStatsByAreaId
  );
  const getAreaStats = (areaId: number) => {
    const areaStats = allAreaStats[areaId];
    const statsFuture = loadItemIfNecessary(areaStats, dispatch, {
      actionOnLoad: () => dispatch(assignmentStatsLoad(areaId)),
      actionOnSuccess: (data) =>
        dispatch(assignmentStatsLoaded([areaId, data])),
      loader: async () => {
        if ([15, 16, 19, 28].includes(areaId)) {
          const res = await fetch(`/areaAssignmentStats/${areaId}.json`);
          const stats: ZetkinAreaStats = await res.json();
          return stats;
        }
        return null;
      },
    });
    return futureToObject(statsFuture).data;
  };

  return getAreaStats;
}
