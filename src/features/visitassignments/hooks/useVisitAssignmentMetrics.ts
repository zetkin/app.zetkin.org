import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { metricsLoad, metricsLoaded } from 'features/visitassignments/store';
import { ZetkinMetric } from 'features/visitassignments/types';

export default function useVisitAssignmentMetrics(
  campId: number,
  orgId: number,
  visitAssId: number
) {
  const apiClient = useApiClient();
  const metricsList = useAppSelector(
    (state) => state.visitAssignments.metricsByAssignmentId[visitAssId]
  );

  const url = `/beta/orgs/${orgId}/projects/${campId}/visitassignments/${visitAssId}/metrics`;

  return useRemoteList(metricsList, {
    actionOnLoad: () => metricsLoad(visitAssId),
    actionOnSuccess: (data) => metricsLoaded([visitAssId, data]),
    loader: () => apiClient.get<ZetkinMetric[]>(url),
  });
}
