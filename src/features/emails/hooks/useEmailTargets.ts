import { EmailTargets } from '../types';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import useEmail from './useEmail';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { IFuture, LoadingFuture } from 'core/caching/futures';
import { targetsLoad, targetsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmailTargets(
  orgId: number,
  emailId: number
): IFuture<EmailTargets> {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const targetsById = useAppSelector((state) => state.emails.targetsById);
  const targetsItem = targetsById[emailId];
  const { data: email } = useEmail(orgId, emailId);

  if (!email?.target.id) {
    return new LoadingFuture();
  }

  return loadItemIfNecessary(targetsItem, dispatch, {
    actionOnLoad: () => targetsLoad(emailId),
    actionOnSuccess: (data) => targetsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<
        ZetkinSmartSearchFilterStats[] & { id: number }
      >(`/api/orgs/${orgId}/people/queries/${email.target.id}/stats`);
      return { allTargets: data[0]?.result || 0, id: emailId };
    },
  });
}
