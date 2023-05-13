import { useEffect, useState } from 'react';

import { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import { DaySummary } from '../components/utils';
import getPrevEventDay from 'features/events/rpc/getPrevEventDay';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

export default function usePrevActivityDay(
  focusDate: Date
): [Date, DaySummary] | null {
  const [prevActivityDay, setPrevActivityDay] = useState<
    [Date, DaySummary] | null
  >(null);
  const apiClient = useApiClient();
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
              endDate: null,
              kind: ACTIVITIES.EVENT,
              startDate: event.published ? new Date(event.published) : null,
            })),
            startingActivities: [],
          },
        ]);
      }
    }

    loadPrev();
  }, [focusDateStr]);

  return prevActivityDay;
}
