import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  currentCallDeleted,
  currentCallLoad,
  currentCallLoaded,
} from '../store';
import { ZetkinCall, ZetkinCallPatchBody } from '../types';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(currentCallDeleted(callId));
  };

  const skipCall = async (assignmentId: number) => {
    dispatch(currentCallLoad());
    const data = await apiClient.post<ZetkinCall>(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
      {}
    );

    dispatch(currentCallLoaded(data));
    return data;
  };

  const switchCurrentCall = async (call: ZetkinCall) => {
    dispatch(currentCallLoaded(call));
  };

  const updateCall = (callId: number, data: ZetkinCallPatchBody) => {
    return apiClient.patch<ZetkinCall>(
      `/api/orgs/${orgId}/calls/${callId}`,
      data
    );
  };

  return { deleteCall, skipCall, switchCurrentCall, updateCall };
}
