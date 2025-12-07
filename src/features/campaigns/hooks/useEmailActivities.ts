import { ACTIVITIES, CampaignActivity } from '../types';
import { emailsLoad, emailsLoaded } from 'features/emails/store';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useEmailActivities(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const apiClient = useApiClient();
  const emailsList = useAppSelector((state) => state.emails.emailList);

  const activities: CampaignActivity[] = [];

  const allEmails = useRemoteList(emailsList, {
    actionOnLoad: () => emailsLoad(),
    actionOnSuccess: (data) => emailsLoaded(data),
    loader: () => apiClient.get(`/api/orgs/${orgId}/emails`),
  });

  if (!allEmails) {
    return new LoadingFuture();
  }

  if (allEmails) {
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
