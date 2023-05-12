import dayjs from 'dayjs';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import range from 'utils/range';
import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  ACTIVITIES,
  EventActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';
import { eventRangeLoad, eventRangeLoaded } from '../store';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

export default function useEventsFromDateRange(
  startDate: Date,
  endDate: Date
): EventActivity[] {
  const promRef = useRef<Promise<void>>();
  const { campId, orgId } = useNumericRouteParams();
  const apiClient = useApiClient();
  const dispatch = useDispatch();
  const eventsState = useSelector((state: RootState) => state.events);

  const dateRange = range(dayjs(endDate).diff(startDate, 'day')).map((diff) => {
    const curDate = new Date(startDate);
    curDate.setDate(curDate.getDate() + diff);
    return curDate;
  });

  const mustLoad = dateRange.some((date) =>
    shouldLoad(eventsState.eventsByDate[date.toISOString().slice(0, 10)])
  );

  if (mustLoad) {
    dispatch(eventRangeLoad(dateRange));
    const promise = apiClient
      .get<ZetkinEvent[]>(
        `/api/orgs/${orgId}/actions?filter=start_time>${startDate
          .toISOString()
          .slice(0, 10)}&filter=end_time<=${endDate.toISOString().slice(0, 10)}`
      )
      .then((events) => {
        dispatch(eventRangeLoaded([dateRange, events]));
      });

    // This will suspend React from rendering this branch
    // until the promise resolves.
    throw promise;
  }

  const isLoading = dateRange.some(
    (date) =>
      eventsState.eventsByDate[date.toISOString().slice(0, 10)].isLoading
  );

  if (isLoading && promRef.current) {
    throw promRef.current;
  }

  const events = dateRange.flatMap((date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return eventsState.eventsByDate[dateStr].items
      .filter((item) => !!item.data)
      .map((item) => item.data) as ZetkinEvent[];
  });

  return events
    .filter((event) => !campId || event.campaign?.id == campId)
    .map((event) => ({
      data: event,
      endDate: null,
      kind: ACTIVITIES.EVENT,
      startDate: event.published ? new Date(event.published) : null,
    }));
}
