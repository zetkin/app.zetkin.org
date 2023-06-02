import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import { DaySummary } from '../components/utils';
import getPrevEventDay from 'features/events/rpc/getPrevEventDay';
import { RootState } from 'core/store';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

type ActivityDay = [Date, DaySummary];

type UseDayCalendarNavReturn = {
  nextActivityDay: ActivityDay | null;
  prevActivityDay: ActivityDay | null;
};

export default function useDayCalendarNav(
  focusDate: Date
): UseDayCalendarNavReturn {
  const [nextActivityDay, setNextActivityDay] = useState<ActivityDay | null>(
    null
  );
  const [prevActivityDay, setPrevActivityDay] = useState<ActivityDay | null>(
    null
  );
  const apiClient = useApiClient();
  const eventsByDate = useSelector(
    (state: RootState) => state.events.eventsByDate
  );
  const { orgId, campId } = useNumericRouteParams();

  const focusDateStr = focusDate.toISOString().slice(0, 10);

  useEffect(() => {
    setPrevActivityDay(null);

    async function loadPrev() {
      // Ask the server about the most recent day that includes events
      const prevEventDay = await apiClient.rpc(getPrevEventDay, {
        beforeDate: focusDate.toISOString(),
        campaignId: campId,
        orgId,
      });

      if (prevEventDay) {
        setPrevActivityDay([
          new Date(prevEventDay.date),
          {
            endingActivities: [],
            events: prevEventDay.events.map((event) => ({
              data: event,
              kind: ACTIVITIES.EVENT,
              visibleFrom: event.published ? new Date(event.published) : null,
              visibleUntil: new Date(event.end_time),
            })),
            startingActivities: [],
          },
        ]);
      }
    }

    loadPrev();

    // Find the first already loaded entry that is after the focusDate
    const nextEntry = Object.entries(eventsByDate)
      .filter((entry) => !!entry[1].items.length)
      .sort((e0, e1) => new Date(e0[0]).getTime() - new Date(e1[0]).getTime())
      .find((entry) => new Date(entry[0]) > focusDate);

    if (nextEntry) {
      setNextActivityDay([
        new Date(nextEntry[0]),
        {
          endingActivities: [],
          events: nextEntry[1].items
            .filter((item) => !!item.data)
            .map((item) => ({
              data: item.data!,
              kind: ACTIVITIES.EVENT,
              visibleFrom: item.data!.published
                ? new Date(item.data!.published)
                : null,
              visibleUntil: null,
            })),
          startingActivities: [],
        },
      ]);
    }
  }, [focusDateStr]);

  return {
    nextActivityDay,
    prevActivityDay,
  };
}
