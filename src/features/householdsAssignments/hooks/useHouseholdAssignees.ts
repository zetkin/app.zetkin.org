import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinHouseholdAssignee } from '../types';
import { assigneesLoad, assigneesLoaded } from '../store';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useHouseholdsAssignees(
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(
    (state) =>
      state.householdAssignments.assigneesByAssignmentId[householdsAssId]
  );

  return loadListIfNecessary(sessions, dispatch, {
    actionOnLoad: () => assigneesLoad(householdsAssId),

    actionOnSuccess: (data) => assigneesLoaded([householdsAssId, data]),
    loader: () =>
      fetchAllPaginated(
        (page) =>
          apiClient.get<ZetkinHouseholdAssignee[]>(
            `/beta/orgs/${orgId}/householdsassignment/${householdsAssId}/assignees?size=100&page=${page}`
          ),
        100
      ),
  });
}
