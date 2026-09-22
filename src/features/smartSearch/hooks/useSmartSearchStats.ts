import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinSmartSearchFilter } from '../components/types';
import { ZetkinSmartSearchFilterStats } from '../types';
import { statsLoad, statsLoaded } from '../store';
import {
  useApiClient,
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';

function filterSpecForStats(
  filters: ZetkinSmartSearchFilter[]
): ZetkinSmartSearchFilter[] {
  return filters.map((filter) => {
    const spec = { ...filter } as ZetkinSmartSearchFilter & { id?: number };
    delete spec.id;

    return spec;
  });
}

export default function useSmartSearchStats(
  filters: ZetkinSmartSearchFilter[]
): ZetkinSmartSearchFilterStats[] | null {
  const { orgId } = useNumericRouteParams();
  const specForStats = filterSpecForStats(filters);
  const key = JSON.stringify(specForStats);

  const apiClient = useApiClient();
  const statsItem = useAppSelector(
    (state) => state.smartSearch.statsByFilterSpec[key]
  );
  const dispatch = useAppDispatch();

  if (shouldLoad(statsItem)) {
    dispatch(statsLoad(key));
    apiClient
      .post<
        ZetkinSmartSearchFilterStats[],
        { filter_spec: ZetkinSmartSearchFilter[] }
      >(`/api/orgs/${orgId}/people/queries/ephemeral/stats`, {
        filter_spec: specForStats,
      })
      .then((stats) => {
        dispatch(statsLoaded([key, stats]));
      });
  }

  return statsItem?.data?.stats ?? null;
}
