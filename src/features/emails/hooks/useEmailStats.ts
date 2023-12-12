import { EmailStats } from '../types';
import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
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
  const statsById = emailSlice.statsById;
  const statsItem = statsById[emailId];

  const statsFuture = loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(emailId),
    actionOnSuccess: () => statsLoaded({ allTargets: 11, id: 1 }),
    //wrong loader, fix it later
    loader: () => apiClient.get<EmailStats>(`/api/orgs/${orgId}`),
  });
  return { statsFuture };
}
