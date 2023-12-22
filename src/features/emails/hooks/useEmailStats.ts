import { EmailStats } from '../types';
import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import useEmail from './useEmail';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseEmailStatsReturn {
  statsFuture: IFuture<EmailStats>;
}

export default function useEmailStats(
  orgId: number,
  emailId: number
): UseEmailStatsReturn {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const emailSlice = useAppSelector((state) => state.emails);
  const email = useEmail(orgId, emailId);
  const statsById = emailSlice.statsById;
  const statsItem = statsById[emailId];

  const statsFuture = loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(emailId),
    actionOnSuccess: (data) => statsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<
        ZetkinSmartSearchFilterStats[] & { id: number }
      >(`/api/orgs/${orgId}/people/queries/${email.data?.target.id}/stats`);
      return { allTargets: data[0]?.result || 0, id: emailId };
    },
  });
  return { statsFuture };
}
