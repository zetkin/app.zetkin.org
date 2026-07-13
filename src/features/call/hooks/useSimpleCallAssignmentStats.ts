import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { ZetkinCallAssignmentStats } from 'features/callAssignments/apiTypes';
import {
  simpleStatsLoad,
  simpleStatsLoaded,
} from 'features/callAssignments/store';

export default function useSimpleCallAssignmentStats(
  orgId: number,
  assignmentId: number
): ZetkinCallAssignmentStats & { id: number } {
  const apiClient = useApiClient();
  const statsItem = useAppSelector(
    (state) => state.callAssignments.simpleStatsById[assignmentId]
  );

  return useRemoteItem(statsItem, {
    actionOnLoad: () => simpleStatsLoad(assignmentId),
    actionOnSuccess: (data) => simpleStatsLoaded([assignmentId, data]),
    loader: () =>
      apiClient.get<ZetkinCallAssignmentStats & { id: number }>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/stats`
      ),
  });
}
