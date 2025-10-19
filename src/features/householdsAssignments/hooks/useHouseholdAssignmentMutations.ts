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
  campId: number,
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    addMetric: async (metric: ZetkinMetricPostBody) => {
      const created = await apiClient.post<ZetkinMetric, ZetkinMetricPostBody>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/metrics`,
        metric
      );

      dispatch(metricCreated([householdsAssId, created]));
    },
    assignHousehold: async (userId: number, householdId: number) => {
      await apiClient.put<ZetkinHouseholdAssignee>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/households/${householdId}/assignees/${userId}`
      );

      const assignee: ZetkinHouseholdAssignee = {
        assignment_id: householdsAssId,
        household_id: householdId,
        user_id: userId,
      };

      dispatch(assigneeAdded(assignee));
    },
    deleteHouseholdAssignment: async () => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`
      );
      dispatch(householdAssignmentDeleted(householdsAssId));
    },
    deleteMetric: async (metricId: number) => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/metrics/${metricId}`
      );
      dispatch(metricDeleted([householdsAssId, metricId]));
    },
    unassignHousehold: async (userId: number, householdId: number) => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/households/${householdId}/assignees/${userId}`
      );

      dispatch(
        assigneeDeleted({
          assigneeId: userId,
          assignmentId: householdsAssId,
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
      >(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`,
        data
      );

      dispatch(householdAssignmentUpdated(updated));
    },
    updateMetric: async (metricId: number, data: ZetkinMetricPatchBody) => {
      const updated = await apiClient.patch<
        ZetkinMetric,
        ZetkinMetricPatchBody
      >(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/metrics/${metricId}`,
        data
      );

      dispatch(metricUpdated([householdsAssId, updated]));
    },
  };
}
