import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import {
  metricsLoad,
  metricsLoaded,
} from 'features/householdsAssignments/store';
import { ZetkinMetric } from 'features/householdsAssignments/types';

export default function useHouseholdAssignmentMetrics(
  campId: number,
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const metricsList = useAppSelector(
    (state) => state.householdAssignments.metricsByAssignmentId[householdsAssId]
  );

  const url = `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/metrics`;

  return useRemoteList(metricsList, {
    actionOnLoad: () => metricsLoad(householdsAssId),
    actionOnSuccess: (data) => metricsLoaded([householdsAssId, data]),
    loader: () => apiClient.get<ZetkinMetric[]>(url),
  });
}
