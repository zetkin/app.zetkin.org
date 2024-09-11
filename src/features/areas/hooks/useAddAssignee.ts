import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCanvassAssignee } from '../types';
import { assigneeAdd, assigneeAdded } from '../store';

export default function useAddAssignee(
  orgId: number,
  campId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (assigneeId: number) => {
    dispatch(assigneeAdd([canvassAssId, assigneeId]));
    const assignee = await apiClient.put<ZetkinCanvassAssignee>(
      `/beta/orgs/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}/assignees/${assigneeId}`
    );
    dispatch(assigneeAdded([canvassAssId, assignee]));
  };
}
