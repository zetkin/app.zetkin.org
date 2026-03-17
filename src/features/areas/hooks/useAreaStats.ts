import { useAppSelector } from 'core/hooks';
import {
  assignmentStatsLoad,
  assignmentStatsLoaded,
} from 'features/areas/store';
import { ZetkinAreaStats } from '../types';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useAreaStats(areaId: number) {
  const assignmentStats = useAppSelector(
    (state) => state.areas.assignmentStatsByAreaId[areaId]
  );

  return useRemoteItem(assignmentStats, {
    actionOnLoad: () => assignmentStatsLoad(areaId),
    actionOnSuccess: (data) => assignmentStatsLoaded([areaId, data]),
    loader: async () => {
      //TODO: Replace with real API-call
      const res = await fetch(`/areaAssignmentStats/${areaId}.json`);
      const data: ZetkinAreaStats = await res.json();
      return data;
    },
  });
}
