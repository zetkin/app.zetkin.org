import { futureToObject } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEmail } from 'utils/types/zetkin';
import { emailLoad, emailLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseEmailReturn {
  data: ZetkinEmail | null;
}

export default function useEmail(
  orgId: number,
  emailId: number
): UseEmailReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const emailItems = useAppSelector((state) => state.emails.emailList.items);
  const emailItem = emailItems.find((item) => item.id == emailId);

  const emailFuture = loadItemIfNecessary(emailItem, dispatch, {
    actionOnLoad: () => emailLoad(emailId),
    actionOnSuccess: () =>
      emailLoaded({
        content: 'world',
        id: 1,
        organization: { id: 6, title: 'Casework test' },
        published: '2023-12-11T12:53:42',
        subject: 'any',
        title: 'Hello!',
      }),
    // loader: () => apiClient.get(`api/orgs/${orgId}/emails/${emailId}`),
    loader: () => apiClient.get(`/api/orgs/${orgId}`),
  });
  return {
    ...futureToObject(emailFuture),
  };
}
