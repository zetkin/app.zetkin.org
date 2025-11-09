import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinHouseholdAssignment,
  ZetkinHouseholdAssignmentPatchbody,
  ZetkinMetric,
  ZetkinMetricPostBody,
  ZetkinMetricPatchBody,
} from 'features/householdsAssignments/types';
import {
  householdAssignmentDeleted,
  householdAssignmentUpdated,
  metricCreated,
  metricDeleted,
  metricUpdated,
} from 'features/householdsAssignments/store';

interface UseHouseholdAssignmentReturn {
  addMetric: (metric: ZetkinMetricPostBody) => void;
  deleteHouseholdAssignment: () => void;
  deleteMetric: (metricId: number) => void;
  updateHouseholdAssignment: (data: ZetkinHouseholdAssignmentPatchbody) => void;
  updateMetric: (metricId: number, data: ZetkinMetricPatchBody) => void;
}

export default function useHouseholdAssignmentMutations(
  campId: number,
  orgId: number,
  householdsAssId: number
): UseHouseholdAssignmentReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const addMetric = async (metric: ZetkinMetricPostBody) => {
    const created = await apiClient.post<ZetkinMetric, ZetkinMetricPostBody>(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/metrics`,
      metric
    );
    dispatch(metricCreated([householdsAssId, created]));
  };

  const deleteHouseholdAssignment = async () => {
    await apiClient.delete(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`
    );
    dispatch(householdAssignmentDeleted(householdsAssId));
  };

  const deleteMetric = async (metricId: number) => {
    await apiClient.delete(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/metrics/${metricId}`
    );
    dispatch(metricDeleted([householdsAssId, metricId]));
  };

  const updateHouseholdAssignment = async (
    data: ZetkinHouseholdAssignmentPatchbody
  ) => {
    const updated = await apiClient.patch<
      ZetkinHouseholdAssignment,
      ZetkinHouseholdAssignmentPatchbody
    >(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`,
      data
    );
    dispatch(householdAssignmentUpdated([updated, Object.keys(data)]));
  };

  const updateMetric = async (
    metricId: number,
    data: ZetkinMetricPatchBody
  ) => {
    const updated = await apiClient.patch<ZetkinMetric, ZetkinMetricPatchBody>(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/metrics/${metricId}`,
      data
    );
    dispatch(metricUpdated([householdsAssId, updated]));
  };

  return {
    addMetric,
    deleteHouseholdAssignment,
    deleteMetric,
    updateHouseholdAssignment,
    updateMetric,
  };
}
