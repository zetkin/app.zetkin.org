import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import {
  activityLoad,
  activityLoaded,
  campaignLoad,
  campaignLoaded,
  locationLoad,
  locationLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ZetkinActivity,
  ZetkinCampaign,
  ZetkinLocation,
} from 'utils/types/zetkin';

type CampaignParticipationTitles = {
  activityTitle: string | null;
  campaignTitle: string | null;
  locationTitle: string | null;
};

export default function useTitlesForCampaignParticipation(
  orgId: number,
  activityId: number | undefined,
  campaignId: number | undefined,
  locationId: number | undefined
): CampaignParticipationTitles {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const activityItem = useAppSelector((state) =>
    state.smartSearch.activityList.items.find((item) => item.id == activityId)
  );
  const campaignItem = useAppSelector((state) =>
    state.smartSearch.campaignList.items.find((item) => item.id == campaignId)
  );
  const locationItem = useAppSelector((state) =>
    state.smartSearch.locationList.items.find((item) => item.id == locationId)
  );

  const titles: CampaignParticipationTitles = {
    activityTitle: null,
    campaignTitle: null,
    locationTitle: null,
  };

  if (activityId !== undefined && activityId !== null) {
    const activity = loadItemIfNecessary(activityItem, dispatch, {
      actionOnLoad: () => activityLoad(activityId),
      actionOnSuccess: (data) => activityLoaded(data),
      loader: () =>
        apiClient.get<ZetkinActivity>(
          `/api/orgs/${orgId}/activities/${activityId}`
        ),
    });
    titles.activityTitle = activity.data?.title ?? null;
  }

  if (campaignId !== undefined && campaignId !== null) {
    const campaign = loadItemIfNecessary(campaignItem, dispatch, {
      actionOnLoad: () => campaignLoad(campaignId),
      actionOnSuccess: (data) => campaignLoaded(data),
      loader: () =>
        apiClient.get<ZetkinCampaign>(
          `/api/orgs/${orgId}/projects/${campaignId}`
        ),
    });
    titles.campaignTitle = campaign.data?.title ?? null;
  }

  if (locationId !== undefined && locationId !== null) {
    const location = loadItemIfNecessary(locationItem, dispatch, {
      actionOnLoad: () => locationLoad(locationId),
      actionOnSuccess: (data) => locationLoaded(data),
      loader: () =>
        apiClient.get<ZetkinLocation>(
          `/api/orgs/${orgId}/locations/${locationId}`
        ),
    });
    titles.locationTitle = location.data?.title ?? null;
  }

  return {
    activityTitle: titles.activityTitle,
    campaignTitle: titles.campaignTitle,
    locationTitle: titles.locationTitle,
  };
}
