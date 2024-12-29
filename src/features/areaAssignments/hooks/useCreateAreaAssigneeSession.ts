import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinAreaAssignmentSession,
  ZetkinAreaAssignmentSessionPostBody,
} from '../types';
import { areaAssignmentSessionCreated } from '../store';

export default function useCreateAreaAssignmentSession(
  orgId: number,
  areaAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinAreaAssignmentSessionPostBody) => {
    const created = await apiClient.post<
      ZetkinAreaAssignmentSession,
      ZetkinAreaAssignmentSessionPostBody
    >(`/beta/orgs/${orgId}/areaassignments/${areaAssId}/sessions`, data);
    dispatch(areaAssignmentSessionCreated(created));
  };
}
