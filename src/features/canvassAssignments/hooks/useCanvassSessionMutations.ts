import { useApiClient, useAppDispatch } from 'core/hooks';
import { sessionDeleted } from '../store';

export default function useCanvassSessionMutations(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    deleteAssignee: async (areaId: string, personId: number) => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/areaassignment/${canvassAssId}/areas/${areaId}/assignees/${personId}`
      );
      dispatch(
        sessionDeleted({
          areaId,
          assigneeId: personId,
          assignmentId: canvassAssId,
        })
      );
    },
  };
}
