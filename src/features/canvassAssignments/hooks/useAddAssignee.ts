import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCanvassAssignee } from '../types';
import { assigneeAdd, assigneeAdded } from '../store';

export default function useAddAssignee(orgId: number, canvassAssId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (personId: number) => {
    dispatch(assigneeAdd([canvassAssId, personId]));
    const assignee = await apiClient.put<ZetkinCanvassAssignee>(
      `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/assignees/${personId}`
    );
    dispatch(assigneeAdded([canvassAssId, assignee]));
  };
}
