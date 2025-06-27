import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  allocateNewCall,
  clearEventResponses,
  clearSurveySubmissions,
  callDeleted,
  newCallAllocated,
  clearReport,
  updateLaneStep,
  clearCurrentCall,
  callUpdated,
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

  const quitCurrentCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(callDeleted(callId));
    dispatch(clearCurrentCall());
    dispatch(updateLaneStep(LaneStep.STATS));
    dispatch(clearSurveySubmissions());
    dispatch(clearEventResponses());
    dispatch(clearReport());
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

  const updateCall = async (callId: number, data: CallReport) => {
    const updatedCall = await apiClient.patch<
      ZetkinCallPatchResponse,
      CallReport
    >(`/api/orgs/${orgId}/calls/${callId}`, data);
    dispatch(callUpdated(updatedCall));
  };

  return {
    deleteCall,
    logNewCall,
    quitCurrentCall,
    updateCall,
  };
}
