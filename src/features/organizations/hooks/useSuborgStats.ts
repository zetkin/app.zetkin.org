import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { suborgStatsLoad, suborgStatsLoaded } from '../store';
import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinSmartSearchFilter } from 'utils/types/zetkin';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';

export default function useSuborgStats(orgId: number) {
  const apiClient = useApiClient();
  const statsItem = useAppSelector(
    (state) => state.organizations.statsBySuborgId[orgId]
  );

  const dispatch = useAppDispatch();

  if (shouldLoad(statsItem)) {
    dispatch(suborgStatsLoad(orgId));
    apiClient
      .post<
        ZetkinSmartSearchFilterStats[],
        { filter_spec: ZetkinSmartSearchFilter[] }
      >(`/api/orgs/${orgId}/people/queries/ephemeral/stats`, {
        filter_spec: [
          {
            config: {},
            op: OPERATION.ADD,
            type: FILTER_TYPE.ALL,
          },
        ],
      })
      .then((stats) => {
        dispatch(suborgStatsLoaded([orgId, stats]));
      });
  }

  return statsItem?.data?.stats ?? null;
}
