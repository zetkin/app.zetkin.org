import { futureToObject } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEmail } from 'utils/types/zetkin';
import { emailLoad, emailLoaded, emailUpdate, emailUpdated } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseEmailReturn {
  data: ZetkinEmail | null;
  updateEmail: (data: Partial<ZetkinEmail>) => ZetkinEmail;
}

const fakeEmail: ZetkinEmail = {
  campaign_id: 121,
  content: 'world',
  id: 1,
  organization: { id: 6, title: 'Casework test' },
  published: '',
  subject: 'any',
  target_query: {
    filter_spec: [],
    organization_id: 6,
    query_type: 'email_target',
    title: '',
  },
  title: 'Hello!',
};

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
    actionOnSuccess: () => emailLoaded(fakeEmail),
    // loader: () => apiClient.get(`api/orgs/${orgId}/emails/${emailId}`),
    //wrong loader, fix it later
    loader: () => apiClient.get(`/api/orgs/${orgId}`),
  });

  const updateEmail = (data: Partial<ZetkinEmail>) => {
    const mutating = Object.keys(data);
    dispatch(emailUpdate([emailId, mutating]));
    dispatch(emailUpdated([{ ...fakeEmail, title: data.title! }, mutating]));
    return { ...fakeEmail, title: data.title! };
  };

  return {
    ...futureToObject(emailFuture),
    updateEmail,
  };
}
