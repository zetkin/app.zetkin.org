import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinAreaAssignment, ZetkinAreaAssignmentPatchbody } from '../types';
import { areaAssignmentDeleted, areaAssignmentUpdated } from '../store';

export default function useAreaAssignmentMutations(
  orgId: number,
  areaAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    deleteAreaAssignment: async () => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/areaassignments/${areaAssId}`
      );
      dispatch(areaAssignmentDeleted(parseInt(areaAssId)));
    },
    updateAreaAssignment: async (data: ZetkinAreaAssignmentPatchbody) => {
      const updated = await apiClient.patch<
        ZetkinAreaAssignment,
        ZetkinAreaAssignmentPatchbody
      >(`/beta/orgs/${orgId}/areaassignments/${areaAssId}`, data);

      dispatch(areaAssignmentUpdated(updated));
    },
  };
}
