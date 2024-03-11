import Router from 'next/router';

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

type ZetkinEmailPatchBody = Partial<Omit<ZetkinEmail, 'locked'>> & {
  locked?: boolean;
};

interface UseEmailReturn {
  data: ZetkinEmail | null;
  deleteEmail: () => Promise<void>;
  isLoading: boolean;
  isTargeted: boolean;
  mutating: string[];
  updateEmail: (data: ZetkinEmailPatchBody) => IFuture<ZetkinEmail>;
  updateTargets: (query: Partial<ZetkinQuery>) => Promise<void>;
}

export default function useEmail(
  orgId: number,
  emailId: number
): UseEmailReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const emailItems = useAppSelector((state) => state.emails.emailList.items);
  const emailItem = emailItems.find((item) => item.id == emailId);
  const email = emailItem?.data;

  const emailFuture = loadItemIfNecessary(emailItem, dispatch, {
    actionOnLoad: () => emailLoad(emailId),
    actionOnSuccess: (email) => emailLoaded(email),
    loader: () => apiClient.get(`/api/orgs/${orgId}/emails/${emailId}`),
  });

  const deleteEmail = async () => {
    await apiClient.delete(`/api/orgs/${orgId}/emails/${emailId}`);

    if (email?.campaign) {
      Router.push(
        `/organize/${orgId}/projects/${email.campaign.id}/activities`
      );
    } else {
      Router.push(`/organize/${orgId}/projects`);
    }
    dispatch(emailDeleted(emailId));
  };

  const isTargeted = !!(
    emailFuture.data && emailFuture.data.target?.filter_spec?.length != 0
  );

  const updateEmail = (data: ZetkinEmailPatchBody) => {
    const mutating = Object.keys(data);
    dispatch(emailUpdate([emailId, mutating]));
    const promise = apiClient
      .patch<ZetkinEmail, ZetkinEmailPatchBody>(
        `/api/orgs/${orgId}/emails/${emailId}`,
        data
      )
      .then((email: ZetkinEmail) => {
        dispatch(emailUpdated([email, mutating]));
        return email;
      });
    return new PromiseFuture(promise);
  };

  const updateTargets = async (query: Partial<ZetkinQuery>) => {
    if (email) {
      dispatch(emailUpdate([emailId, ['target']]));

      const target = await apiClient.patch<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries/${email.target.id}`,
        query
      );

      dispatch(
        emailUpdated([
          {
            ...email,
            target: target,
          },
          ['target'],
        ])
      );
    }
  };

  return {
    ...futureToObject(emailFuture),
    deleteEmail,
    isTargeted,
    mutating: emailItem?.mutating || [],
    updateEmail,
    updateTargets,
  };
}
