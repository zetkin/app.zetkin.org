import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinVisitAssignment } from 'features/visitassignments/types';
import {
  visitAssignmentLoad,
  visitAssignmentLoaded,
  visitAssignmentUpdate,
  visitAssignmentUpdated,
} from 'features/visitassignments/store';
import { ZetkinQuery } from 'utils/types/zetkin';
import { futureToObject, IFuture } from 'core/caching/futures';

interface UseVisitAssignmentReturn {
  data: ZetkinVisitAssignment | null;
  visitAssignmentFuture: IFuture<ZetkinVisitAssignment>;
  isTargeted: boolean;
  updateTargets: (query: Partial<ZetkinQuery>) => void;
}

export default function useVisitAssignment(
  campId: number,
  orgId: number,
  visitAssId: number
): UseVisitAssignmentReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const visitAssignmentSlice = useAppSelector(
    (state) => state.visitAssignments
  );
  const visitAssignmentItems = visitAssignmentSlice.visitAssignmentList.items;
  const vaItem = visitAssignmentItems.find((item) => item.id === visitAssId);
  const visitAssignment = vaItem?.data;

  const visitAssignmentFuture = loadItemIfNecessary(vaItem, dispatch, {
    actionOnLoad: () => visitAssignmentLoad(visitAssId),
    actionOnSuccess: (data) => visitAssignmentLoaded(data),
    loader: () =>
      apiClient.get<ZetkinVisitAssignment>(
        `/beta/orgs/${orgId}/projects/${campId}/visitassignments/${visitAssId}`
      ),
  });

  const isTargeted = !!(
    visitAssignmentFuture.data &&
    visitAssignmentFuture.data.target?.filter_spec?.length != 0
  );

  const updateTargets = (query: Partial<ZetkinQuery>): void => {
    if (visitAssignment) {
      dispatch(visitAssignmentUpdate([visitAssId, ['target']]));
      fetch(`/api/orgs/${orgId}/people/queries/${visitAssignment.target.id}`, {
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })
        .then((res) => res.json())
        .then((data: { data: ZetkinQuery }) => {
          dispatch(
            visitAssignmentUpdated([
              { ...visitAssignment, target: data.data },
              ['target'],
            ])
          );
        });
    }
  };

  return {
    ...futureToObject(visitAssignmentFuture),
    isTargeted,
    updateTargets,
    visitAssignmentFuture: visitAssignmentFuture,
  };
}
