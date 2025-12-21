import { futureToObject, IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { targetsLoad, targetsLoaded } from 'features/visitassignments/store';
import { ZetkinPerson } from 'utils/types/zetkin';

interface UseVisitTargetsReturn {
  data: ZetkinPerson[] | null;
  allTargetsFuture: IFuture<ZetkinPerson[]>;
}

export default function useVisitTargets(
  orgId: number,
  visitAssId: number
): UseVisitTargetsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const visitAssignments = useAppSelector((state) => state.visitAssignments);
  const targetsList = visitAssignments.targetsByAssignmentId[visitAssId];

  const allTargetsFuture = loadListIfNecessary(targetsList, dispatch, {
    actionOnLoad: () => targetsLoad(visitAssId),
    actionOnSuccess: (data) => targetsLoaded([data, visitAssId]),
    loader: () =>
      apiClient.get<ZetkinPerson[]>(
        `/beta/orgs/${orgId}/visitassignments/${visitAssId}/targets`
      ),
  });

  return {
    ...futureToObject(allTargetsFuture),
    allTargetsFuture,
  };
}
