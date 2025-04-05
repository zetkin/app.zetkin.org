import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinAreaAssignment, ZetkinAreaAssignmentPatchbody } from '../types';
import { areaAssignmentDeleted, areaAssignmentUpdated } from '../store';

export default function useAreaAssignmentMutations(
  orgId: number,
  areaAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    deleteAreaAssignment: async () => {
      await apiClient.delete(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}`
      );
      dispatch(areaAssignmentDeleted(areaAssId));
    },
    updateAreaAssignment: async (data: ZetkinAreaAssignmentPatchbody) => {
      const updated = await apiClient.patch<
        ZetkinAreaAssignment,
        ZetkinAreaAssignmentPatchbody
      >(`/api2/orgs/${orgId}/area_assignments/${areaAssId}`, data);

      dispatch(areaAssignmentUpdated(updated));
    },
  };
}
