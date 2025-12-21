import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinVisitAssignment,
  ZetkinVisitAssignmentPatchbody,
  ZetkinMetric,
  ZetkinMetricPostBody,
  ZetkinMetricPatchBody,
} from 'features/visitassignments/types';
import {
  visitAssignmentDeleted,
  visitAssignmentUpdated,
  metricCreated,
  metricDeleted,
  metricUpdated,
} from 'features/visitassignments/store';

interface UseVisitAssignmentReturn {
  addMetric: (metric: ZetkinMetricPostBody) => void;
  deleteVisitAssignment: () => void;
  deleteMetric: (metricId: number) => void;
  updateVisitAssignment: (data: ZetkinVisitAssignmentPatchbody) => void;
  updateMetric: (metricId: number, data: ZetkinMetricPatchBody) => void;
}

export default function useVisitAssignmentMutations(
  orgId: number,
  visitAssId: number
): UseVisitAssignmentReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const addMetric = async (metric: ZetkinMetricPostBody) => {
    const created = await apiClient.post<ZetkinMetric, ZetkinMetricPostBody>(
      `/beta/orgs/${orgId}/visitassignments/${visitAssId}/metrics`,
      metric
    );
    dispatch(metricCreated([visitAssId, created]));
  };

  const deleteVisitAssignment = async () => {
    await apiClient.delete(
      `/beta/orgs/${orgId}/visitassignments/${visitAssId}`
    );
    dispatch(visitAssignmentDeleted(visitAssId));
  };

  const deleteMetric = async (metricId: number) => {
    await apiClient.delete(
      `/beta/orgs/${orgId}/visitassignments/${visitAssId}/metrics/${metricId}`
    );
    dispatch(metricDeleted([visitAssId, metricId]));
  };

  const updateVisitAssignment = async (
    data: ZetkinVisitAssignmentPatchbody
  ) => {
    const updated = await apiClient.patch<
      ZetkinVisitAssignment,
      ZetkinVisitAssignmentPatchbody
    >(`/beta/orgs/${orgId}/visitassignments/${visitAssId}`, data);
    dispatch(visitAssignmentUpdated([updated, Object.keys(data)]));
  };

  const updateMetric = async (
    metricId: number,
    data: ZetkinMetricPatchBody
  ) => {
    const updated = await apiClient.patch<ZetkinMetric, ZetkinMetricPatchBody>(
      `/beta/orgs/${orgId}/visitassignments/${visitAssId}/metrics/${metricId}`,
      data
    );
    dispatch(metricUpdated([visitAssId, updated]));
  };

  return {
    addMetric,
    deleteMetric,
    deleteVisitAssignment,
    updateMetric,
    updateVisitAssignment,
  };
}
