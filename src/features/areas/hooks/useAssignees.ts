import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCanvassAssignee } from '../types';
import { assigneesLoad, assigneesLoaded } from '../store';

export default function useAssignees(
  orgId: number,
  campId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assigneeList = useAppSelector(
    (state) => state.areas.assigneesByCanvassAssignmentId[canvassAssId]
  );

  return loadListIfNecessary(assigneeList, dispatch, {
    actionOnLoad: () => assigneesLoad(canvassAssId),
    actionOnSuccess: (data) => assigneesLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<ZetkinCanvassAssignee[]>(
        `/beta/orgs/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}/assignees`
      ),
  });
}
