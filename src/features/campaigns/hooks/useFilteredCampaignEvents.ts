import { useAppDispatch, useAppSelector } from 'core/hooks';
import useUpcomingCampaignEvents from './useUpcomingCampaignEvents';
import { filtersUpdated } from '../store';
import useFilteredEvents from 'features/events/hooks/useFilteredEvents';

export default function useFilteredCampaignEvents(
  campId: number,
  orgId: number
) {
  const events = useUpcomingCampaignEvents(campId, orgId);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.campaigns.filters);

  const filtersWithUnusedOrgIds = {
    ...filters,
    orgIdsToFilterBy: [],
  };

  return useFilteredEvents({
    events,
    filters: filtersWithUnusedOrgIds,
    onChange: (newFilters) => dispatch(filtersUpdated(newFilters)),
  });
}
