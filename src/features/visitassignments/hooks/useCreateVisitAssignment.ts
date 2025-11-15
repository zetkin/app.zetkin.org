import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinVisitAssignment, ZetkinVisitAssignmentPostBody } from '../types';
import { visitAssignmentCreated } from '../store';

export default function useCreateVisitAssignment(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinVisitAssignmentPostBody) => {
    const created = await apiClient.post<
      ZetkinVisitAssignment,
      ZetkinVisitAssignmentPostBody
    >(`/beta/orgs/${orgId}/visitassignments`, data);
    dispatch(visitAssignmentCreated(created));
  };
}
