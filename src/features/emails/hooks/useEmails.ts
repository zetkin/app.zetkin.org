import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEmail } from 'utils/types/zetkin';
import { emailsLoad, emailsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmails(orgId: number): IFuture<ZetkinEmail[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const emailList = useAppSelector((state) => state.emails.emailList);

  return loadListIfNecessary(emailList, dispatch, {
    actionOnLoad: () => emailsLoad(),
    actionOnSuccess: (emails) => emailsLoaded(emails),
    loader: () => apiClient.get<ZetkinEmail[]>(`/api/orgs/${orgId}/emails`),
  });
}
