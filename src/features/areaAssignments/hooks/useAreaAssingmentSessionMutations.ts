import { useApiClient, useAppDispatch } from 'core/hooks';
import { sessionDeleted } from '../store';

export default function useAreaAssignmentSessionMutations(
  orgId: number,
  areaAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    deleteSession: async (areaId: string, personId: number) => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/areaassignment/${areaAssId}/areas/${areaId}/assignees/${personId}`
      );
      dispatch(
        sessionDeleted({
          areaId,
          assigneeId: personId,
          assignmentId: areaAssId,
        })
      );
    },
  };
}
