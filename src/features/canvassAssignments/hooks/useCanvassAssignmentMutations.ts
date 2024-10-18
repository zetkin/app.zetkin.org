import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinCanvassAssignment,
  ZetkinCanvassAssignmentPatchbody,
} from '../types';
import { canvassAssignmentUpdated } from '../store';

export default function useCanvassAssignmentMutations(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinCanvassAssignmentPatchbody) => {
    const updated = await apiClient.patch<
      ZetkinCanvassAssignment,
      ZetkinCanvassAssignmentPatchbody
    >(`/beta/orgs/${orgId}/canvassassignments/${canvassAssId}`, data);

    dispatch(canvassAssignmentUpdated(updated));
  };
}
