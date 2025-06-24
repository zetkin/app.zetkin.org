import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  allocateNewCall,
  clearEventResponses,
  clearSurveyResponses,
  callDeleted,
  newCallAllocated,
  reportDeleted,
  updateLaneStep,
  clearCurrentCall,
} from '../store';
import { ZetkinCall, CallReport, LaneStep } from '../types';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const abandonCurrentCall = () => {
    dispatch(clearCurrentCall());
    dispatch(updateLaneStep(LaneStep.STATS));
    dispatch(clearSurveyResponses());
    dispatch(clearEventResponses());
    dispatch(reportDeleted());
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
    dispatch(clearSurveyResponses());
    dispatch(clearEventResponses());
    dispatch(reportDeleted());
  };

  const updateCall = (callId: number, data: CallReport) => {
    return apiClient.patch<ZetkinCall, CallReport>(
      `/api/orgs/${orgId}/calls/${callId}`,
      data
    );
  };

  return { abandonCurrentCall, deleteCall, logNewCall, updateCall };
}
