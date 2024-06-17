import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ACTIVITIES, CampaignActivity } from '../types';
import { emailsLoad, emailsLoaded } from 'features/emails/store';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmailActivities(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const emailsList = useAppSelector((state) => state.emails.emailList);

  const activities: CampaignActivity[] = [];

  const allEmailsFuture = loadListIfNecessary(emailsList, dispatch, {
    actionOnLoad: () => dispatch(emailsLoad),
    actionOnSuccess: (data) => dispatch(emailsLoaded(data)),
    loader: () => apiClient.get(`/api/orgs/${orgId}/emails`),
  });

  if (allEmailsFuture.isLoading) {
    return new LoadingFuture();
  } else if (allEmailsFuture.error) {
    return new ErrorFuture(allEmailsFuture.error);
  }

  if (allEmailsFuture.data) {
    const allEmails = allEmailsFuture.data;

    if (campId) {
      const campaignEmails = allEmails.filter(
        (email) => email.campaign?.id === campId
      );

      campaignEmails.forEach((email) => {
        activities.push({
          data: email,
          kind: ACTIVITIES.EMAIL,
          visibleFrom: email.published ? new Date(email.published) : null,
          visibleUntil: email.published ? new Date(email.published) : null,
        });
      });
    } else {
      allEmails.forEach((email) => {
        activities.push({
          data: email,
          kind: ACTIVITIES.EMAIL,
          visibleFrom: email.published ? new Date(email.published) : null,
          visibleUntil: email.published ? new Date(email.published) : null,
        });
      });
    }
  }

  return new ResolvedFuture(activities);
}
