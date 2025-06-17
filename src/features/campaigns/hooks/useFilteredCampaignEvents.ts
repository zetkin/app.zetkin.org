import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { useAppSelector } from 'core/hooks';
import useMyEvents from 'features/events/hooks/useMyEvents';
import useUpcomingCampaignEvents from './useUpcomingCampaignEvents';
import { ZetkinEventWithStatus } from 'features/home/types';

export default function useFilteredCampaignEvents(
  campId: number,
  orgId: number
) {
  const events = useUpcomingCampaignEvents(campId, orgId);
  const myEvents = useMyEvents();

  const { customDatesToFilterBy, dateFilterState } = useAppSelector(
    (state) => state.campaigns.filters
  );

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

  const filteredEvents = allEvents.filter((event) => {
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
        (eventStart.isSame(start, 'day') || eventStart.isAfter(start, 'day')) &&
        (eventStart.isSame(end, 'day') || eventStart.isBefore(end, 'day'));
      const endsInPeriod =
        (eventEnd.isSame(start, 'day') || eventEnd.isAfter(start, 'day')) &&
        (eventEnd.isBefore(end, 'day') || eventEnd.isSame(end, 'day'));
      return isOngoing || startsInPeriod || endsInPeriod;
    }
  });

  return { allEvents, filteredEvents, getDateRange };
}
