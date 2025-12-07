import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ACTIVITIES, CampaignActivity } from '../types';
import {
  campaignEventsLoad,
  campaignEventsLoaded,
  eventsLoad,
  eventsLoaded,
} from 'features/events/store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useEventActivities(
  orgId: number,
  campId?: number
): CampaignActivity[] {
  const apiClient = useApiClient();
  const eventsSlice = useAppSelector((state) => state.events);

  const activities: CampaignActivity[] = [];

  // Call both hooks unconditionally, use isNecessary to control which loads
  const eventsByCampaignId = campId
    ? eventsSlice.eventsByCampaignId[campId]
    : undefined;
  const campaignEvents = useRemoteList(eventsByCampaignId, {
    actionOnLoad: () => campaignEventsLoad(campId!),
    actionOnSuccess: (data) => campaignEventsLoaded([campId!, data]),
    cacheKey: `campaignEvents-${orgId}-${campId}`,
    isNecessary: () => !!campId,
    loader: async () =>
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${orgId}/campaigns/${campId}/actions`
      ),
  });

  const eventList = eventsSlice.eventList;
  const allEvents = useRemoteList(eventList, {
    actionOnLoad: () => eventsLoad(),
    actionOnSuccess: (data) => eventsLoaded(data),
    cacheKey: `allEvents-${orgId}`,
    isNecessary: () => !campId,
    loader: () => apiClient.get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`),
  });

  // Use the appropriate list based on campId
  const events = campId ? campaignEvents : allEvents;

  events.forEach((event) => {
    activities.push({
      data: event,
      kind: ACTIVITIES.EVENT,
      visibleFrom: getUTCDateWithoutTime(event.published || null),
      visibleUntil: getUTCDateWithoutTime(event.end_time || null),
    });
  });

  return activities;
}
