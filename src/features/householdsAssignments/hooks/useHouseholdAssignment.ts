import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinHouseholdAssignment } from '../types';
import {
  householdAssignmentLoad,
  householdAssignmentLoaded,
  householdAssignmentUpdate,
  householdAssignmentUpdated,
} from '../store';
import { ZetkinQuery } from 'utils/types/zetkin';
import { futureToObject } from 'core/caching/futures';

interface UseHouseholdAssignmentReturn {
  data: ZetkinHouseholdAssignment | null;
  isTargeted: boolean;
  updateTargets: (query: Partial<ZetkinQuery>) => void;
}

export default function useHouseholdAssignment(
  campId: number,
  orgId: number,
  householdsAssId: number
): UseHouseholdAssignmentReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const householdAssignmentSlice = useAppSelector(
    (state) => state.householdAssignments
  );
  const householdAssignmentItems =
    householdAssignmentSlice.householdAssignmentList.items;
  const haItem = householdAssignmentItems.find(
    (item) => item.id === householdsAssId
  );
  const householdAssignment = haItem?.data;

  const householdsAssignmentFuture = loadItemIfNecessary(haItem, dispatch, {
    actionOnLoad: () => householdAssignmentLoad(householdsAssId),
    actionOnSuccess: (data) => householdAssignmentLoaded(data),
    loader: () =>
      apiClient.get<ZetkinHouseholdAssignment>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`
      ),
  });

  const isTargeted = !!(
    householdsAssignmentFuture.data &&
    householdsAssignmentFuture.data.target?.filter_spec?.length != 0
  );

  const updateTargets = (query: Partial<ZetkinQuery>): void => {
    if (householdAssignment) {
      dispatch(householdAssignmentUpdate([householdsAssId, ['target']]));
      fetch(
        `/api/orgs/${orgId}/people/queries/${householdAssignment.target.id}`,
        {
          body: JSON.stringify(query),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        }
      )
        .then((res) => res.json())
        .then((data: { data: ZetkinQuery }) => {
          dispatch(
            householdAssignmentUpdated([
              { ...householdAssignment, target: data.data },
              ['target'],
            ])
          );
        });
    }
  };

  return {
    ...futureToObject(householdsAssignmentFuture),
    isTargeted,
    updateTargets,
  };
}
