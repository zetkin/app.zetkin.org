import {
  useApiClient,
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';
import {
  assignmentStatsLoad,
  assignmentStatsLoaded,
} from 'features/areas/store';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { futureToObject } from 'core/caching/futures';
import { ZetkinAreaStats } from '../types';

export default function useAreaStats() {
  const { orgId } = useNumericRouteParams();
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const allAreaStats = useAppSelector(
    (state) => state.areas.assignmentStatsByAreaId
  );

  const getAreaStats = (areaId: number) => {
    const areaStats = allAreaStats[areaId];
    const statsFuture = loadItemIfNecessary(areaStats, dispatch, {
      actionOnLoad: () => dispatch(assignmentStatsLoad(areaId)),
      actionOnSuccess: (data) =>
        dispatch(assignmentStatsLoaded([areaId, data])),
      loader: () =>
        apiClient.get<ZetkinAreaStats>(
          `/api2/orgs/${orgId}/areas/${areaId}/stats`
        ),
    });
    return futureToObject(statsFuture).data;
  };

  return getAreaStats;
}
