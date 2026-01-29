import { useAppDispatch, useAppSelector } from 'core/hooks';
import useUpcomingOrgEvents from './useUpcomingOrgEvents';
import { filtersUpdated } from '../store';
import useFilteredEvents from 'features/events/hooks/useFilteredEvents';

export default function useFilteredOrgEvents(orgId: number) {
  const dispatch = useAppDispatch();
  const events = useUpcomingOrgEvents(orgId);
  const filters = useAppSelector((state) => state.organizations.filters);

  return useFilteredEvents({
    events,
    filters,
    onChange: (newFilters) => dispatch(filtersUpdated(newFilters)),
  });
}
