import range from 'utils/range';
import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ACTIVITIES, EventActivity } from 'features/campaigns/types';
import { eventRangeLoad, eventRangeLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventsFromDateRange(
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  orgId: number,
  campId?: number
): EventActivity[] {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventsState = useAppSelector((state) => state.events);

  const dateRange = range(endDate.since(startDate).total('days') + 1)
    .map((offset) => startDate.add({ days: offset }))
    .map((plainDate) => plainDate.toString());

  const mustLoad = dateRange.some((date) =>
    shouldLoad(eventsState.eventsByDate[date])
  );

  if (mustLoad) {
    dispatch(eventRangeLoad(dateRange));
    const apiEndDate = endDate.add({ days: 1 });
    const promise = apiClient
      .get<
        ZetkinEvent[]
      >(`/api/orgs/${orgId}/actions?filter=start_time>${startDate.toString()}&filter=end_time<${apiEndDate.toString()}`)
      .then((events) => {
        dispatch(eventRangeLoaded([events, dateRange]));
      });

    // This will suspend React from rendering this branch
    // until the promise resolves.
    throw promise;
  }

  const events = dateRange.flatMap((date) => {
    const dateStr = date.slice(0, 10);
    return eventsState.eventsByDate[dateStr].items
      .filter((item) => !!item.data && !item.deleted)
      .map((item) => item.data) as ZetkinEvent[];
  });

  return events
    .filter((event) => !campId || event.campaign?.id == campId)
    .map((event) => ({
      data: event,
      kind: ACTIVITIES.EVENT,
      visibleFrom: event.published ? new Date(event.published) : null,
      visibleUntil: new Date(event.end_time),
    }));
}
