import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  quitCall,
  unfinishedCallAbandoned,
  callSkippedLoaded,
  callSkippedLoad,
  allocateCallError,
  switchedToUnfinishedCall,
  allocatePreviousCall,
  upcomingEventsInvalidated,
} from '../store';
import { UnfinishedCall } from '../types';
import useMyAssignments from './useMyAssignments';
import { surveysInvalidated } from 'features/surveys/store';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assignments = useMyAssignments();

  // Activities are cached per org, so switching to a call in another org
  // must invalidate them or the previous org's activities would linger.
  const invalidateActivitiesOnOrgChange = (targetOrgId: number) => {
    if (targetOrgId != orgId) {
      dispatch(upcomingEventsInvalidated());
      dispatch(surveysInvalidated());
    }
  };

  const abandonUnfinishedCall = async (
    assignmentId: number,
    callId: number
  ) => {
    const assignment = assignments.find(
      (assignment) => assignment.id == assignmentId
    );

    if (assignment) {
      await apiClient.delete(
        `/api/orgs/${assignment.organization.id}/calls/${callId}`
      );
      dispatch(unfinishedCallAbandoned(callId));
    }
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
    const assignment = assignments.find(
      (assignment) => assignment.id == assignmentId
    );

    if (assignment) {
      const newCall = await apiClient.post<
        UnfinishedCall,
        { target_id: number }
      >(
        `/api/orgs/${assignment.organization.id}/call_assignments/${assignmentId}/calls`,
        {
          target_id: targetId,
        }
      );
      dispatch(allocatePreviousCall(newCall));
      invalidateActivitiesOnOrgChange(assignment.organization.id);
    }
  };

  const switchToUnfinishedCall = (callId: number, assignmentId: number) => {
    dispatch(switchedToUnfinishedCall([callId, assignmentId]));

    const assignment = assignments.find(
      (assignment) => assignment.id == assignmentId
    );
    if (assignment) {
      invalidateActivitiesOnOrgChange(assignment.organization.id);
    }
  };

  return {
    abandonUnfinishedCall,
    quitCurrentCall,
    skipCurrentCall,
    switchToPreviousCall,
    switchToUnfinishedCall,
  };
}
