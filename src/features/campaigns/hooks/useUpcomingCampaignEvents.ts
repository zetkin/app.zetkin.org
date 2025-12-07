import { ZetkinEvent } from 'utils/types/zetkin';
import {
  campaignEventsLoad,
  campaignEventsLoaded,
} from 'features/events/store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import getEventState from 'features/events/utils/getEventState';
import { EventState } from 'features/events/hooks/useEventState';

export default function useUpcomingCampaignEvents(
  orgId: number,
  campId: number
): ZetkinEvent[] {
  const apiClient = useApiClient();
  const eventsByCampaignId = useAppSelector(
    (state) => state.events.eventsByCampaignId
  );
  const campaignEvents = eventsByCampaignId[campId];

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const futureCampaignEvents = useRemoteList(campaignEvents, {
    actionOnLoad: () => campaignEventsLoad(campId),
    actionOnSuccess: (data) => campaignEventsLoaded([campId, data]),
    cacheKey: `upcoming-campaign-events-${orgId}-${campId}`,
    loader: () =>
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${orgId}/campaigns/${campId}/actions?filter=end_time>=${today}`
      ),
  });

  return futureCampaignEvents.filter((event) => {
    const eventState = getEventState(event);
    return eventState == EventState.OPEN || eventState == EventState.SCHEDULED;
  });
}
