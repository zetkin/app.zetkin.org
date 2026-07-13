import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinAreaAssignment, ZetkinAreaAssignmentPostBody } from '../types';
import { areaAssignmentCreated } from '../store';

export default function useCreateAreaAssignment(orgId: number, projId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinAreaAssignmentPostBody) => {
    const created = await apiClient.post<
      ZetkinAreaAssignment,
      ZetkinAreaAssignmentPostBody
    >(`/api2/orgs/${orgId}/projects/${projId}/area_assignments`, data);
    dispatch(areaAssignmentCreated(created));
  };
}
