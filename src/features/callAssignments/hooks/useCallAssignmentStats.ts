import { CallAssignmentStats } from '../apiTypes';
import useCallAssignment from './useCallAssignment';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';

interface UseCallAssignmentStatsReturn {
  hasTargets: boolean;
  stats: CallAssignmentStats | null;
  statusBarStatsList: { color: string; value: number }[];
}

export default function useCallAssignmentStats(
  orgId: number,
  assignmentId: number
): UseCallAssignmentStatsReturn {
  const apiClient = useApiClient();
  const callAssignmentSlice = useAppSelector((state) => state.callAssignments);
  const statsById = callAssignmentSlice.statsById;
  const statsItem = statsById[assignmentId];
  const { isTargeted } = useCallAssignment(orgId, assignmentId);

  const statsData = useRemoteItem(statsItem, {
    actionOnLoad: () => statsLoad(assignmentId),
    actionOnSuccess: (data) => statsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<CallAssignmentStats & { id: number }>(
        `/api/callAssignments/targets?org=${orgId}&assignment=${assignmentId}`
      );
      return { ...data, id: assignmentId };
    },
  });

  const stats = isTargeted ? statsData : null;
  const hasTargets = stats ? stats.blocked + stats.ready > 0 : false;

  const statusBarStatsList =
    hasTargets && stats
      ? [
          {
            color: 'statusColors.orange',
            value: stats.blocked,
          },
          {
            color: 'statusColors.blue',
            value: stats.ready,
          },
          {
            color: 'statusColors.green',
            value: stats.done,
          },
        ]
      : [
          {
            color: 'statusColors.grey',
            value: 1,
          },
          {
            color: 'statusColors.grey',
            value: 1,
          },
          {
            color: 'statusColors.grey',
            value: 1,
          },
        ];

  return {
    hasTargets,
    stats,
    statusBarStatsList,
  };
}
