import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  campaignEventsLoad,
  campaignEventsLoaded,
} from 'features/events/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCampaignEvents(
  orgId: number,
  campId: number
): ZetkinEvent[] {
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

  return campaignEventsFuture.data || [];
}
