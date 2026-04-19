import { useAppDispatch, useAppSelector } from 'core/hooks';
import useUpcomingProjectEvents from './useUpcomingProjectEvents';
import { filtersUpdated } from '../store';
import useFilteredEvents from 'features/events/hooks/useFilteredEvents';

export default function useFilteredProjectEvents(
  projectId: number,
  orgId: number
) {
  const events = useUpcomingProjectEvents(projectId, orgId);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.projects.filters);

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
