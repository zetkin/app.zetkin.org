import { useCallback } from 'react';

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
import useMyAssignments from './useMyAssignments';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assignments = useMyAssignments();

  const abandonUnfinishedCall = useCallback(
    async (assignmentId: number, callId: number) => {
      const assignment = assignments.find(
        (assignment) => assignment.id == assignmentId
      );

      if (!assignment) {
        //If you are no longer a caller in that assignment,
        //we try with the org id of the assignments you are assigned,
        //since it is likely that at least one is from the same org
        for (const assignment of assignments) {
          try {
            await apiClient.delete(
              `/api/orgs/${assignment.organization.id}/calls/${callId}`
            );
            dispatch(unfinishedCallAbandoned(callId));
            break;
          } catch {
            //Do nothing
          }
        }
      }

      if (assignment) {
        await apiClient.delete(
          `/api/orgs/${assignment.organization.id}/calls/${callId}`
        );
        dispatch(unfinishedCallAbandoned(callId));
      }
    },
    [apiClient, assignments, dispatch]
  );

  const quitCurrentCall = useCallback(
    async (callId: number) => {
      await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
      dispatch(quitCall(callId));
    },
    [apiClient, dispatch, orgId]
  );

  const skipCurrentCall = useCallback(
    async (assignmentId: number, skippedCallId: number) => {
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
    },
    [apiClient, dispatch, orgId]
  );

  const switchToPreviousCall = useCallback(
    async (assignmentId: number, targetId: number) => {
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
      }
    },
    [apiClient, assignments, dispatch]
  );

  const switchToUnfinishedCall = useCallback(
    (callId: number, assignmentId: number) => {
      dispatch(switchedToUnfinishedCall([callId, assignmentId]));
    },
    [dispatch]
  );

  return {
    abandonUnfinishedCall,
    quitCurrentCall,
    skipCurrentCall,
    switchToPreviousCall,
    switchToUnfinishedCall,
  };
}
