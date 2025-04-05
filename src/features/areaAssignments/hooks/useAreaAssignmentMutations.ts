import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinAreaAssignee,
  ZetkinAreaAssignment,
  ZetkinAreaAssignmentPatchbody,
} from '../types';
import {
  areaAssignmentDeleted,
  areaAssignmentUpdated,
  assigneeAdded,
  assigneeDeleted,
} from '../store';

export default function useAreaAssignmentMutations(
  orgId: number,
  areaAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    assignArea: async (userId: number, areaId: number) => {
      await apiClient.put<ZetkinAreaAssignee>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/areas/${areaId}/assignees/${userId}`
      );

      const assignee: ZetkinAreaAssignee = {
        area_id: areaId,
        assignment_id: areaAssId,
        user_id: userId,
      };

      dispatch(assigneeAdded(assignee));
    },
    deleteAreaAssignment: async () => {
      await apiClient.delete(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}`
      );
      dispatch(areaAssignmentDeleted(areaAssId));
    },
    unassignArea: async (userId: number, areaId: number) => {
      await apiClient.delete(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/areas/${areaId}/assignees/${userId}`
      );

      dispatch(
        assigneeDeleted({
          areaId,
          assigneeId: userId,
          assignmentId: areaAssId,
        })
      );
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
