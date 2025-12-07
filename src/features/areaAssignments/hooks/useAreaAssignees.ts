import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignee } from '../types';
import { assigneesLoad, assigneesLoaded } from '../store';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useAreaAssignees(
  orgId: number,
  areaAssId: number
): ZetkinAreaAssignee[] {
  const apiClient = useApiClient();
  const sessions = useAppSelector(
    (state) => state.areaAssignments.assigneesByAssignmentId[areaAssId]
  );

  return useRemoteList(sessions, {
    actionOnLoad: () => assigneesLoad(areaAssId),
    actionOnSuccess: (data) => assigneesLoaded([areaAssId, data]),
    cacheKey: `area-assignees-${orgId}-${areaAssId}`,
    loader: () =>
      fetchAllPaginated(
        (page) =>
          apiClient.get<ZetkinAreaAssignee[]>(
            `/api2/orgs/${orgId}/area_assignments/${areaAssId}/assignees?size=100&page=${page}`
          ),
        100
      ),
  });
}
