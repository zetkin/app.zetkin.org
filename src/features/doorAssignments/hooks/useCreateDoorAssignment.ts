import { useApiClient, useAppDispatch } from '../../../core/hooks';
import { ZetkinDoorAssignment, ZetkinDoorAssignmentPostBody } from '../types';
import { doorAssignmentCreated } from '../store';

export default function useCreateDoorAssignment(orgId: number, projId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinDoorAssignmentPostBody) => {
    const created = await apiClient.post<
      ZetkinDoorAssignment,
      ZetkinDoorAssignmentPostBody
    >(`/api2/orgs/${orgId}/projects/${projId}/door_assignments`, data);
    dispatch(doorAssignmentCreated(created));
  };
}
