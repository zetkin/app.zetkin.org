import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinCanvassAssignment,
  ZetkinCanvassAssignmentPatchbody,
} from '../types';
import { canvassAssignmentDeleted, canvassAssignmentUpdated } from '../store';

export default function useCanvassAssignmentMutations(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    deleteCanvassAssignment: async () => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}`
      );
      dispatch(canvassAssignmentDeleted(parseInt(canvassAssId)));
    },
    updateCanvassAssignment: async (data: ZetkinCanvassAssignmentPatchbody) => {
      const updated = await apiClient.patch<
        ZetkinCanvassAssignment,
        ZetkinCanvassAssignmentPatchbody
      >(`/beta/orgs/${orgId}/canvassassignments/${canvassAssId}`, data);

      dispatch(canvassAssignmentUpdated(updated));
    },
  };
}
