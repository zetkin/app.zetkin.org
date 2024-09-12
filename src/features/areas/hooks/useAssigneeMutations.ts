import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinCanvassAssignee,
  ZetkinCanvassAssigneePatchBody,
} from '../types';
import { assigneeUpdated } from '../store';

export default function useAssigneeMutations(
  orgId: number,
  campId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (assigneeId: number, data: ZetkinCanvassAssigneePatchBody) => {
    const updated = await apiClient.patch<
      ZetkinCanvassAssignee,
      ZetkinCanvassAssigneePatchBody
    >(
      `/beta/orgs/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}/assignees/${assigneeId}`,
      data
    );

    dispatch(assigneeUpdated([canvassAssId, updated]));
  };
}
