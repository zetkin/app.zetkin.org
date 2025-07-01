import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  allocateNewCall,
  clearEventResponses,
  clearSurveySubmissions,
  callDeleted,
  newCallAllocated,
  clearReport,
  updateLaneStep,
  callUpdated,
  quitCall,
  unfinishedCallAbandoned,
  callSkippedLoaded,
  callSkippedLoad,
  allocateCallError,
} from '../store';
import {
  ZetkinCall,
  CallReport,
  LaneStep,
  ZetkinCallPatchResponse,
} from '../types';

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

  const deleteCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(callDeleted(callId));
  };

  const logNewCall = async (assignmentId: number, targetId: number) => {
    dispatch(allocateNewCall());
    const call = await apiClient.post<ZetkinCall, { target_id: number }>(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}/calls`,
      {
        target_id: targetId,
      }
    );
    dispatch(newCallAllocated(call));
    dispatch(updateLaneStep(LaneStep.PREPARE));
    dispatch(clearSurveySubmissions());
    dispatch(clearEventResponses());
    dispatch(clearReport());
  };

  const skipCurrentCall = async (
    assignmentId: number,
    skippedCallId: number
  ) => {
    dispatch(callSkippedLoad());
    await apiClient.delete(`/api/orgs/${orgId}/calls/${skippedCallId}`);
    try {
      const newCall = await apiClient.post<ZetkinCall>(
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

  const updateCall = async (callId: number, data: CallReport) => {
    const updatedCall = await apiClient.patch<
      ZetkinCallPatchResponse,
      CallReport
    >(`/api/orgs/${orgId}/calls/${callId}`, data);
    dispatch(callUpdated(updatedCall));
  };

  return {
    abandonUnfinishedCall,
    deleteCall,
    logNewCall,
    quitCurrentCall,
    skipCurrentCall,
    updateCall,
  };
}
