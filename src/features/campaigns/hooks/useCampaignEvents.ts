import dayjs from 'dayjs';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  campaignEventsLoad,
  campaignEventsLoaded,
} from 'features/events/store';
import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseCampaignEventsReturn {
  firstEvent: ZetkinEvent | undefined;
  lastEvent: ZetkinEvent | undefined;
  numberOfUpcomingEvents: number;
}

export default function useCampaignEvents(
  orgId: number,
  campId: number
): UseCampaignEventsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventsByCampaignId = useAppSelector(
    (state) => state.events.eventsByCampaignId
  );

  const campaignEventsFuture = loadListIfNecessary(
    eventsByCampaignId[campId],
    dispatch,
    {
      actionOnLoad: () => campaignEventsLoad(campId),
      actionOnSuccess: (data) => campaignEventsLoaded([campId, data]),
      loader: () =>
        apiClient.get<ZetkinEvent[]>(
          `/api/orgs/${orgId}/campaigns/${campId}/actions`
        ),
    }
  );

  const campaignEvents = campaignEventsFuture.data || [];

  const firstAndLast = getFirstAndLastEvent(campaignEvents);

  const numberOfUpcomingEvents = campaignEvents.filter((event) =>
    dayjs(removeOffset(event.end_time)).isAfter(dayjs())
  ).length;

  return {
    firstEvent: firstAndLast[0],
    lastEvent: firstAndLast[1],
    numberOfUpcomingEvents,
  };
}
