import { futureToObject } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { emailLoad, emailLoaded, emailUpdate, emailUpdated } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEmail, ZetkinQuery } from 'utils/types/zetkin';

interface UseEmailReturn {
  data: ZetkinEmail | null;
  isTargeted: boolean;
  updateEmail: (data: Partial<ZetkinEmail>) => ZetkinEmail;
  updateTargets: (query: Partial<ZetkinQuery>) => void;
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
    id: 6,
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

  const isTargeted = !!(
    emailFuture.data && emailFuture.data.target_query?.filter_spec?.length != 0
  );

  const updateEmail = (data: Partial<ZetkinEmail>) => {
    const mutating = Object.keys(data);
    dispatch(emailUpdate([emailId, mutating]));
    dispatch(emailUpdated([{ ...fakeEmail, title: data.title! }, mutating]));
    return { ...fakeEmail, title: data.title! };
  };

  const updateTargets = (query: Partial<ZetkinQuery>): void => {
    if (emailItem?.data) {
      //need to fix when there is API for it
      dispatch(emailUpdate([emailId, ['target_query']]));
      dispatch(
        emailUpdated([
          {
            ...emailItem?.data,
            target_query: {
              filter_spec: query.filter_spec!,
              id: 6,
            },
          },
          ['target_query'],
        ])
      );
    }
  };

  return {
    ...futureToObject(emailFuture),
    isTargeted,
    updateEmail,
    updateTargets,
  };
}
