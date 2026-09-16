import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignee } from '../types';
import { assigneesLoad, assigneesLoaded, assigneesError } from '../store';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useAreaAssignees(orgId: number, areaAssId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(
    (state) => state.areaAssignments.assigneesByAssignmentId[areaAssId]
  );

  return loadListIfNecessary(sessions, dispatch, {
    actionOnError: (err) => assigneesError([areaAssId, err]),
    actionOnLoad: () => assigneesLoad(areaAssId),
    actionOnSuccess: (data) => assigneesLoaded([areaAssId, data]),
    loader: () =>
      fetchAllPaginated((page, size) =>
        apiClient.get<ZetkinAreaAssignee[]>(
          `/api2/orgs/${orgId}/area_assignments/${areaAssId}/assignees?size=${size}&page=${page}`
        )
      ),
  });
}
