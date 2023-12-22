import { EmailStats } from '../types';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import useEmail from './useEmail';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { IFuture, LoadingFuture } from 'core/caching/futures';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmailStats(
  orgId: number,
  emailId: number
): IFuture<EmailStats> {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const emailSlice = useAppSelector((state) => state.emails);
  const { data: email } = useEmail(orgId, emailId);

  if (!email?.target.id) {
    return new LoadingFuture();
  }

  const statsById = emailSlice.statsById;
  const statsItem = statsById[emailId];

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(emailId),
    actionOnSuccess: (data) => statsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<
        ZetkinSmartSearchFilterStats[] & { id: number }
      >(`/api/orgs/${orgId}/people/queries/${email.target.id}/stats`);
      return { allTargets: data[0]?.result || 0, id: emailId };
    },
  });
}
