import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  quitCall,
  unfinishedCallAbandoned,
  callSkippedLoaded,
  callSkippedLoad,
  allocateCallError,
  switchedToUnfinishedCall,
  allocatePreviousCall,
} from '../store';
import { UnfinishedCall } from '../types';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const abandonUnfinishedCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(unfinishedCallAbandoned(callId));
  };

  const quitCurrentCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(quitCall(callId));
  };

  const skipCurrentCall = async (
    assignmentId: number,
    skippedCallId: number
  ) => {
    dispatch(callSkippedLoad());
    await apiClient.delete(`/api/orgs/${orgId}/calls/${skippedCallId}`);
    try {
      const newCall = await apiClient.post<UnfinishedCall>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
        {}
      );
      dispatch(callSkippedLoaded([skippedCallId, newCall]));
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Error skipping call');
      const serialized = {
        message: error.message,
        name: error.name,
      };
      dispatch(allocateCallError(serialized));
      return error;
    }
  };

  const switchToPreviousCall = async (
    assignmentId: number,
    targetId: number
  ) => {
    const newCall = await apiClient.post<UnfinishedCall, { target_id: number }>(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}/calls`,
      {
        target_id: targetId,
      }
    );
    dispatch(allocatePreviousCall(newCall));
  };

  const switchToUnfinishedCall = (callId: number, assignmentId: number) => {
    dispatch(switchedToUnfinishedCall([callId, assignmentId]));
  };

  return {
    abandonUnfinishedCall,
    quitCurrentCall,
    skipCurrentCall,
    switchToPreviousCall,
    switchToUnfinishedCall,
  };
}
