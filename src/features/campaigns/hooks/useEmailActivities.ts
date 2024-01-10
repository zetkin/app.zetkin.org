import { getUTCDateWithoutTime } from 'utils/dateUtils';
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
        const nextDay = new Date(email.published);
        nextDay.setDate(nextDay.getDate() + 1);

        activities.push({
          data: email,
          kind: ACTIVITIES.EMAIL,
          visibleFrom: getUTCDateWithoutTime(email.published || null),
          visibleUntil: getUTCDateWithoutTime(nextDay.toISOString()),
        });
      });
    } else {
      allEmails.forEach((email) => {
        const nextDay = new Date(email.published);
        nextDay.setDate(nextDay.getDate() + 1);

        activities.push({
          data: email,
          kind: ACTIVITIES.EMAIL,
          visibleFrom: getUTCDateWithoutTime(email.published || null),
          visibleUntil: getUTCDateWithoutTime(nextDay.toISOString()),
        });
      });
    }
  }

  return new ResolvedFuture(activities);
}
