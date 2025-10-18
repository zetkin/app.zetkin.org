import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinHouseholdAssignee,
  ZetkinHouseholdAssignment,
  ZetkinHouseholdAssignmentPatchbody,
  ZetkinMetric,
  ZetkinMetricPatchBody,
  ZetkinMetricPostBody,
} from '../types';
import {
  householdAssignmentDeleted,
  householdAssignmentUpdated,
  assigneeAdded,
  assigneeDeleted,
  metricCreated,
  metricDeleted,
  metricUpdated,
} from '../store';

export default function useHouseholdAssignmentMutations(
  orgId: number,
  householdAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    addMetric: async (metric: ZetkinMetricPostBody) => {
      const created = await apiClient.post<ZetkinMetric, ZetkinMetricPostBody>(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/metrics`,
        metric
      );

      dispatch(metricCreated([householdAssId, created]));
    },
    assignHousehold: async (userId: number, householdId: number) => {
      await apiClient.put<ZetkinHouseholdAssignee>(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/households/${householdId}/assignees/${userId}`
      );

      const assignee: ZetkinHouseholdAssignee = {
        assignment_id: householdAssId,
        household_id: householdId,
        user_id: userId,
      };

      dispatch(assigneeAdded(assignee));
    },
    deleteHouseholdAssignment: async () => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}`
      );
      dispatch(householdAssignmentDeleted(householdAssId));
    },
    deleteMetric: async (metricId: number) => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/metrics/${metricId}`
      );
      dispatch(metricDeleted([householdAssId, metricId]));
    },
    unassignHousehold: async (userId: number, householdId: number) => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/households/${householdId}/assignees/${userId}`
      );

      dispatch(
        assigneeDeleted({
          assigneeId: userId,
          assignmentId: householdAssId,
          householdId,
        })
      );
    },
    updateHouseholdAssignment: async (
      data: ZetkinHouseholdAssignmentPatchbody
    ) => {
      const updated = await apiClient.patch<
        ZetkinHouseholdAssignment,
        ZetkinHouseholdAssignmentPatchbody
      >(`/beta/orgs/${orgId}/householdsassignments/${householdAssId}`, data);

      dispatch(householdAssignmentUpdated(updated));
    },
    updateMetric: async (metricId: number, data: ZetkinMetricPatchBody) => {
      const updated = await apiClient.patch<
        ZetkinMetric,
        ZetkinMetricPatchBody
      >(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/metrics/${metricId}`,
        data
      );

      dispatch(metricUpdated([householdAssId, updated]));
    },
  };
}
