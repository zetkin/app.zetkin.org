import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinAreaAssignment, ZetkinAreaAssignmentPostBody } from '../types';
import { areaAssignmentCreated } from '../store';

export default function useCreateAreaAssignment(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinAreaAssignmentPostBody) => {
    const created = await apiClient.post<
      ZetkinAreaAssignment,
      ZetkinAreaAssignmentPostBody
    >(`/beta/orgs/${orgId}/areaassignments`, data);
    dispatch(areaAssignmentCreated(created));
  };
}
