import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinAreaAssignee,
  ZetkinAreaAssignment,
  ZetkinAreaAssignmentPatchbody,
  ZetkinMetric,
  ZetkinMetricPatchBody,
  ZetkinMetricPostBody,
} from '../types';
import {
  areaAssignmentDeleted,
  areaAssignmentUpdated,
  assigneeAdded,
  assigneeDeleted,
  metricCreated,
  metricDeleted,
  metricUpdated,
} from '../store';

export default function useAreaAssignmentMutations(
  orgId: number,
  areaAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    addMetric: async (metric: ZetkinMetricPostBody) => {
      const created = await apiClient.post<ZetkinMetric, ZetkinMetricPostBody>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/metrics`,
        metric
      );

      dispatch(metricCreated([areaAssId, created]));
    },
    assignArea: async (userId: number, areaId: number) => {
      await apiClient.put<ZetkinAreaAssignee>(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/areas/${areaId}/assignees/${userId}`
      );

      const assignee: ZetkinAreaAssignee = {
        area_id: areaId,
        assignment_id: areaAssId,
        user_id: userId,
      };

      dispatch(assigneeAdded(assignee));
    },
    deleteAreaAssignment: async () => {
      await apiClient.delete(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}`
      );
      dispatch(areaAssignmentDeleted(areaAssId));
    },
    deleteMetric: async (metricId: number) => {
      await apiClient.delete(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/metrics/${metricId}`
      );
      dispatch(metricDeleted([areaAssId, metricId]));
    },
    unassignArea: async (userId: number, areaId: number) => {
      await apiClient.delete(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/areas/${areaId}/assignees/${userId}`
      );

      dispatch(
        assigneeDeleted({
          areaId,
          assigneeId: userId,
          assignmentId: areaAssId,
        })
      );
    },
    updateAreaAssignment: async (data: ZetkinAreaAssignmentPatchbody) => {
      const updated = await apiClient.patch<
        ZetkinAreaAssignment,
        ZetkinAreaAssignmentPatchbody
      >(`/api2/orgs/${orgId}/area_assignments/${areaAssId}`, data);

      dispatch(areaAssignmentUpdated(updated));
    },
    updateMetric: async (metricId: number, data: ZetkinMetricPatchBody) => {
      const updated = await apiClient.patch<
        ZetkinMetric,
        ZetkinMetricPatchBody
      >(
        `/api2/orgs/${orgId}/area_assignments/${areaAssId}/metrics/${metricId}`,
        data
      );

      dispatch(metricUpdated([areaAssId, updated]));
    },
  };
}
