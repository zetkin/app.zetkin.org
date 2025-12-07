import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { metricsLoad, metricsLoaded } from '../store';
import { ZetkinMetric } from '../types';

export default function useAreaAssignmentMetrics(
  orgId: number,
  assignmentId: number
) {
  const apiClient = useApiClient();
  const metricsList = useAppSelector(
    (state) => state.areaAssignments.metricsByAssignmentId[assignmentId]
  );

  const url = `/api2/orgs/${orgId}/area_assignments/${assignmentId}/metrics`;

  return useRemoteList(metricsList, {
    actionOnLoad: () => metricsLoad(assignmentId),
    actionOnSuccess: (data) => metricsLoaded([assignmentId, data]),
    cacheKey: `area-assignment-metrics-${orgId}-${assignmentId}`,
    loader: () => apiClient.get<ZetkinMetric[]>(url),
  });
}
