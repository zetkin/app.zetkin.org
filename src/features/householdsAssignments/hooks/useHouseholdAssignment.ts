import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinHouseholdAssignment } from '../types';
import { householdAssignmentLoad, householdAssignmentLoaded } from '../store';

export default function useHouseholdAssignment(
  campId: number,
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const householdAssignmentList = useAppSelector(
    (state) => state.householdAssignments.householdAssignmentList.items
  );
  const householdAssignmentItem = householdAssignmentList.find(
    (item) => item.id == householdsAssId
  );

  return loadItemIfNecessary(householdAssignmentItem, dispatch, {
    actionOnLoad: () => householdAssignmentLoad(householdsAssId),
    actionOnSuccess: (data) => householdAssignmentLoaded(data),
    loader: () =>
      apiClient.get<ZetkinHouseholdAssignment>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`
      ),
  });
}
