import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCanvassAssignee } from '../types';
import { assigneesLoad, assigneesLoaded } from '../store';

export default function useAssignees(orgId: number, canvassAssId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assigneeList = useAppSelector(
    (state) =>
      state.canvassAssignments.assigneesByCanvassAssignmentId[canvassAssId]
  );

  return loadListIfNecessary(assigneeList, dispatch, {
    actionOnLoad: () => assigneesLoad(canvassAssId),
    actionOnSuccess: (data) => assigneesLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<ZetkinCanvassAssignee[]>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/assignees`
      ),
  });
}
