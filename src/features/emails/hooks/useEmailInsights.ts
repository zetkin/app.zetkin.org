import { IFuture } from 'core/caching/futures';
import { EmailInsights } from '../types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { insightsLoad, insightsLoaded } from '../store';
import getEmailInsights from '../rpc/getEmailInsights';

export default function useEmailInsights(
  orgId: number,
  emailId: number
): IFuture<EmailInsights> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const item = useAppSelector(
    (state) => state.emails.insightsByEmailId[emailId]
  );

  return loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => insightsLoad(emailId),
    actionOnSuccess: (data) => insightsLoaded(data),
    loader: () => apiClient.rpc(getEmailInsights, { emailId, orgId }),
  });
}
