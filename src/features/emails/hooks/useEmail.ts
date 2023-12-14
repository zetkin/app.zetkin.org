import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import {
  emailDeleted,
  emailLoad,
  emailLoaded,
  emailUpdate,
  emailUpdated,
} from '../store';
import { futureToObject, IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEmail, ZetkinQuery } from 'utils/types/zetkin';

interface UseEmailReturn {
  data: ZetkinEmail | null;
  deleteEmail: () => Promise<void>;
  isTargeted: boolean;
  updateEmail: (data: Partial<ZetkinEmail>) => IFuture<ZetkinEmail>;
  updateTargets: (query: Partial<ZetkinQuery>) => void;
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
    actionOnSuccess: (email) => emailLoaded(email),
    loader: () => apiClient.get(`/api/orgs/${orgId}/emails/${emailId}`),
  });

  const deleteEmail = async () => {
    await apiClient.delete(`/api/orgs/${orgId}/emails/${emailId}`);
    dispatch(emailDeleted(emailId));
  };

  const isTargeted = !!(
    emailFuture.data && emailFuture.data.target_query?.filter_spec?.length != 0
  );

  const updateEmail = (data: Partial<ZetkinEmail>) => {
    const mutating = Object.keys(data);
    dispatch(emailUpdate([emailId, mutating]));

    const promise = apiClient
      .patch<ZetkinEmail>(`/api/orgs/${orgId}/emails/${emailId}`, data)
      .then((email: ZetkinEmail) => {
        dispatch(emailUpdated([email, mutating]));
        return email;
      });
    return new PromiseFuture(promise);
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
    deleteEmail,
    isTargeted,
    updateEmail,
    updateTargets,
  };
}
