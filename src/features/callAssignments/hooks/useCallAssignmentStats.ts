import { CallAssignmentStats } from '../apiTypes';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import useCallAssignment from './useCallAssignment';
import {
  IFuture,
  PlaceholderFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseCallAssignmentStatsReturn {
  hasTargets: boolean;
  statsFuture: IFuture<CallAssignmentStats>;
  statusBarStatsList: { color: string; value: number }[];
}

export default function useCallAssignmentStats(
  orgId: number,
  assignmentId: number
): UseCallAssignmentStatsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const callAssignmentSlice = useAppSelector((state) => state.callAssignments);
  const statsById = callAssignmentSlice.statsById;
  const statsItem = statsById[assignmentId];
  const { isTargeted } = useCallAssignment(orgId, assignmentId);

  const statsFuture = loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(assignmentId),
    actionOnSuccess: (data) => statsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<CallAssignmentStats & { id: number }>(
        `/api/callAssignments/targets?org=${orgId}&assignment=${assignmentId}`
      );
      return { ...data, id: assignmentId };
    },
  });

  let statsDataFuture: IFuture<CallAssignmentStats | null>;
  if (!isTargeted) {
    statsDataFuture = new ResolvedFuture(null);
  }
  if (statsFuture.isLoading && !statsFuture.data) {
    statsDataFuture = new PlaceholderFuture({
      allTargets: 0,
      allocated: 0,
      blocked: 0,
      callBackLater: 0,
      calledTooRecently: 0,
      callsMade: 0,
      done: 0,
      id: assignmentId,
      missingPhoneNumber: 0,
      mostRecentCallTime: null,
      organizerActionNeeded: 0,
      queue: 0,
      ready: 0,
    });
  } else {
    statsDataFuture = statsFuture;
  }

  const statsData = statsDataFuture.data;
  const hasTargets = statsData
    ? statsData.blocked + statsData.ready > 0
    : false;

  const statusBarStatsList =
    hasTargets && statsData
      ? [
          {
            color: 'statusColors.orange',
            value: statsData.blocked,
          },
          {
            color: 'statusColors.blue',
            value: statsData.ready,
          },
          {
            color: 'statusColors.green',
            value: statsData.done,
          },
        ]
      : [
          {
            color: 'statusColors.gray',
            value: 1,
          },
          {
            color: 'statusColors.gray',
            value: 1,
          },
          {
            color: 'statusColors.gray',
            value: 1,
          },
        ];

  return {
    hasTargets,
    statsFuture,
    statusBarStatsList,
  };
}
