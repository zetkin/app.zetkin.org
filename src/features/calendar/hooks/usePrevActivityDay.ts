import { useEffect, useState } from 'react';

import { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import { DaySummary } from '../components/utils';
import { ZetkinEvent } from 'utils/types/zetkin';
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

    // TODO: Optimize this
    apiClient
      .get<ZetkinEvent[]>(
        `/api/orgs/${orgId}/actions?filter=end_time<${focusDateStr}`
      )
      .then((events) => {
        const filtered = events.filter(
          (event) => !campId || event.campaign?.id == campId
        );
        const sorted = filtered.sort(
          (e0, e1) =>
            new Date(e1.start_time).getTime() -
            new Date(e0.start_time).getTime()
        );
        const mostRecentEvent = sorted[0];

        if (mostRecentEvent) {
          const mostRecentDateStr = mostRecentEvent.start_time.slice(0, 10);
          const relevantEvents = filtered.filter(
            (event) => event.start_time.slice(0, 10) == mostRecentDateStr
          );

          setPrevActivityDay([
            new Date(mostRecentEvent.start_time),
            {
              endingActivities: [],
              events: relevantEvents.map((event) => ({
                data: event,
                endDate: null,
                kind: ACTIVITIES.EVENT,
                startDate: event.published ? new Date(event.published) : null,
              })),
              startingActivities: [],
            },
          ]);
        }
      });
  }, [focusDateStr]);

  return prevActivityDay;
}
