import { IFuture, ResolvedFuture } from 'core/caching/futures';
import { EmailInsights, ZetkinEmailStats } from '../types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import {
  emailLoad,
  emailLoaded,
  insightsLoad,
  insightsLoaded,
  statsLoad,
  statsLoaded,
} from '../store';
import getEmailInsights from '../rpc/getEmailInsights';
import { ZetkinEmail } from 'utils/types/zetkin';

type UseSecondaryEmailInsightsReturn = {
  emailFuture: IFuture<ZetkinEmail | null>;
  insightsFuture: IFuture<EmailInsights | null>;
  statsFuture: IFuture<ZetkinEmailStats | null>;
};

export default function useSecondaryEmailInsights(
  orgId: number,
  emailId: number | null
): UseSecondaryEmailInsightsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.emails);

  if (!emailId) {
    return {
      emailFuture: new ResolvedFuture(null),
      insightsFuture: new ResolvedFuture(null),
      statsFuture: new ResolvedFuture(null),
    };
  }

  const emailItem = state.emailList.items.find((item) => item.id == emailId);
  const emailFuture = loadItemIfNecessary(emailItem, dispatch, {
    actionOnLoad: () => emailLoad(emailId),
    actionOnSuccess: (email) => emailLoaded(email),
    loader: () => apiClient.get(`/api/orgs/${orgId}/emails/${emailId}`),
  });

  const insightsFuture = loadItemIfNecessary(
    state.insightsByEmailId[emailId],
    dispatch,
    {
      actionOnLoad: () => insightsLoad(emailId),
      actionOnSuccess: (data) => insightsLoaded(data),
      loader: () => apiClient.rpc(getEmailInsights, { emailId, orgId }),
    }
  );

  const statsFuture = loadItemIfNecessary(state.statsById[emailId], dispatch, {
    actionOnLoad: () => statsLoad(emailId),
    actionOnSuccess: (data) => statsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<ZetkinEmailStats & { id: number }>(
        `/api/orgs/${orgId}/emails/${emailId}/stats`
      );
      return { ...data, id: emailId };
    },
  });

  return {
    emailFuture,
    insightsFuture,
    statsFuture,
  };
}
