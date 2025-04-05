import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAreaAssignee } from '../types';
import { assigneesLoad, assigneesLoaded } from '../store';

export default function useAreaAssignees(orgId: number, areaAssId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(
    (state) => state.areaAssignments.assigneesByAssignmentId[areaAssId]
  );

  return loadListIfNecessary(sessions, dispatch, {
    actionOnLoad: () => dispatch(assigneesLoad(areaAssId)),

    actionOnSuccess: (data) => dispatch(assigneesLoaded([areaAssId, data])),
    loader: () =>
      apiClient.get<ZetkinAreaAssignee[]>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/assignees`
      ),
  });
}
