import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';

import useMyEvents from 'features/events/hooks/useMyEvents';
import { ZetkinEventWithStatus } from 'features/home/types';
import { getGeoJSONFeaturesAtLocations } from 'features/map/utils/locationFiltering';
import { useEventTypeFilter } from 'features/events/hooks/useEventTypeFilter';
import { ZetkinEvent } from 'utils/types/zetkin';

export type EventFilters = {
  customDatesToFilterBy: DateRange<Dayjs>;
  dateFilterState: 'today' | 'tomorrow' | 'thisWeek' | 'custom' | null;
  eventTypesToFilterBy: string[];
  geojsonToFilterBy: GeoJSON.Feature[];
  orgIdsToFilterBy: number[];
};

type UseFilteredOrgEventsProps = {
  events: ZetkinEvent[];
  filters: EventFilters;
  onChange: (filters: Partial<EventFilters>) => void;
};

export default function useFilteredEvents({
  events,
  filters,
  onChange,
}: UseFilteredOrgEventsProps) {
  const myEvents = useMyEvents();

  const {
    customDatesToFilterBy,
    dateFilterState,
    eventTypesToFilterBy,
    geojsonToFilterBy,
    orgIdsToFilterBy,
  } = filters;

  const getDateRange = (): [Dayjs | null, Dayjs | null] => {
    const today = dayjs();
    if (!dateFilterState || dateFilterState == 'custom') {
      return customDatesToFilterBy;
    } else if (dateFilterState == 'today') {
      return [today, null];
    } else if (dateFilterState == 'tomorrow') {
      return [today.add(1, 'day'), null];
    } else {
      //dateFilterState is 'thisWeek'
      return [today.startOf('week'), today.endOf('week')];
    }
  };

  const allEvents = useMemo(() => {
    return events.map<ZetkinEventWithStatus>((event) => ({
      ...event,
      status:
        myEvents.find((userEvent) => userEvent.id == event.id)?.status || null,
    }));
  }, [events]);

  const eventTypeFilter = useEventTypeFilter(allEvents, {
    eventTypeLabelsToFilterBy: eventTypesToFilterBy,
    setEventTypeLabelsToFilterBy: (newArray) =>
      onChange({ eventTypesToFilterBy: newArray }),
  });

  const filteredEvents = allEvents
    .filter((event) => {
      if (orgIdsToFilterBy.length == 0) {
        return true;
      }
      return orgIdsToFilterBy.includes(event.organization.id);
    })
    .filter((event) => {
      if (
        !dateFilterState ||
        (dateFilterState == 'custom' && !customDatesToFilterBy[0])
      ) {
        return true;
      }

      const [start, end] = getDateRange();
      const eventStart = dayjs(event.start_time);
      const eventEnd = dayjs(event.end_time);

      if (!end) {
        const isOngoing = eventStart.isBefore(start) && eventEnd.isAfter(start);
        const startsOnSelectedDay = eventStart.isSame(start, 'day');
        const endsOnSelectedDay = eventEnd.isSame(start, 'day');
        return isOngoing || startsOnSelectedDay || endsOnSelectedDay;
      } else {
        const isOngoing =
          eventStart.isBefore(start, 'day') && eventEnd.isAfter(end, 'day');
        const startsInPeriod =
          (eventStart.isSame(start, 'day') ||
            eventStart.isAfter(start, 'day')) &&
          (eventStart.isSame(end, 'day') || eventStart.isBefore(end, 'day'));
        const endsInPeriod =
          (eventEnd.isSame(start, 'day') || eventEnd.isAfter(start, 'day')) &&
          (eventEnd.isBefore(end, 'day') || eventEnd.isSame(end, 'day'));
        return isOngoing || startsInPeriod || endsInPeriod;
      }
    })
    .filter(eventTypeFilter.getShouldShowEvent);

  const locationEvents = filteredEvents.filter((event) => {
    if (geojsonToFilterBy.length === 0) {
      return true;
    }

    if (!event?.location) {
      return false;
    }

    const features = getGeoJSONFeaturesAtLocations(
      geojsonToFilterBy,
      event.location
    );

    return features.length > 0;
  });

  return {
    allEvents,
    eventTypeFilter,
    filteredEvents,
    getDateRange,
    locationEvents,
  };
}
