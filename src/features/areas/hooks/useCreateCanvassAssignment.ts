import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinCanvassAssignment,
  ZetkinCanvassAssignmentPostBody,
} from '../types';
import { canvassAssignmentCreate, canvassAssignmentCreated } from '../store';

export default function useCreateCanvassAssignment(
  orgId: number,
  campId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinCanvassAssignmentPostBody) => {
    dispatch(canvassAssignmentCreate());
    const created = await apiClient.post<ZetkinCanvassAssignment>(
      `/beta/orgs/${orgId}/projects/${campId}/canvassassignments`,
      data
    );
    dispatch(canvassAssignmentCreated(created));
  };
}
