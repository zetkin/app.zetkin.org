import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignee } from '../types';
import { assigneesLoad, assigneesLoaded, assigneesLoadError } from '../store';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useAreaAssigneecs(orgId: number, areaAssId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(
    (state) => state.areaAssignments.assigneesByAssignmentId[areaAssId]
  );

  return loadListIfNecessary(sessions, dispatch, {
    actionOnError: (err) => assigneesLoadError([areaAssId, err]),
    actionOnLoad: () => assigneesLoad(areaAssId),
    actionOnSuccess: (data) => assigneesLoaded([areaAssId, data]),
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
