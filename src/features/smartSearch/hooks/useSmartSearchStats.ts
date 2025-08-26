import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinSmartSearchFilter } from '../components/types';
import { ZetkinSmartSearchFilterStats } from '../types';
import { ephemeralStatsLoad, ephemeralStatsLoaded } from '../store';
import {
  useApiClient,
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';

export default function useSmartSearchStats(
  filters: ZetkinSmartSearchFilter[]
): ZetkinSmartSearchFilterStats[] | null {
  const { orgId } = useNumericRouteParams();
  const key = JSON.stringify(filters);
  const apiClient = useApiClient();
  const statsItem = useAppSelector(
    (state) => state.smartSearch.statsByFilterSpec[key]
  );
  const dispatch = useAppDispatch();

  if (shouldLoad(statsItem)) {
    dispatch(ephemeralStatsLoad(key));
    apiClient
      .post<
        ZetkinSmartSearchFilterStats[],
        { filter_spec: ZetkinSmartSearchFilter[] }
      >(`/api/orgs/${orgId}/people/queries/ephemeral/stats`, {
        filter_spec: filters,
      })
      .then((stats) => {
        dispatch(ephemeralStatsLoaded([key, stats]));
      });
  }

  return statsItem?.data?.stats ?? null;
}
