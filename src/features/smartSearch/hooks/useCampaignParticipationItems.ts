import { loadListIfNecessary } from 'core/caching/cacheUtils';
import {
  activitiesLoad,
  activitiesLoaded,
  campaignsLoad,
  campaignsLoaded,
  locationsLoad,
  locationsLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ZetkinActivity,
  ZetkinCampaign,
  ZetkinLocation,
} from 'utils/types/zetkin';

type CampaignParticipationItems = {
  activities: ZetkinActivity[];
  campaigns: ZetkinCampaign[];
  locations: ZetkinLocation[];
};

export default function useCampaignParticipationItems(
  orgId: number
): CampaignParticipationItems {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const activityList = useAppSelector(
    (state) => state.smartSearch.activityList
  );
  const campaignList = useAppSelector(
    (state) => state.smartSearch.campaignList
  );
  const locationList = useAppSelector(
    (state) => state.smartSearch.locationList
  );

  const activities = loadListIfNecessary(activityList, dispatch, {
    actionOnLoad: () => activitiesLoad(),
    actionOnSuccess: (activities) => activitiesLoaded(activities),
    loader: async () =>
      apiClient.get<ZetkinActivity[]>(`/api/orgs/${orgId}/activities`),
  });

  const campaigns = loadListIfNecessary(campaignList, dispatch, {
    actionOnLoad: () => campaignsLoad(),
    actionOnSuccess: (campaigns) => campaignsLoaded(campaigns),
    loader: async () =>
      apiClient.get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns`),
  });

  const locations = loadListIfNecessary(locationList, dispatch, {
    actionOnLoad: () => locationsLoad(),
    actionOnSuccess: (locations) => locationsLoaded(locations),
    loader: async () =>
      apiClient.get<ZetkinLocation[]>(`/api/orgs/${orgId}/locations`),
  });

  return {
    activities: activities.data ?? [],
    campaigns: campaigns.data ?? [],
    locations: locations.data ?? [],
  };
}
