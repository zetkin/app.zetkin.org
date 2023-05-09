import dayjs from 'dayjs';

import { ClusteredEvent } from 'features/campaigns/hooks/useClusteredActivities';
import { clusterEvents } from 'features/campaigns/hooks/useClusteredActivities';
import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function clusterEventsForWeekCalender(
  events: EventActivity[]
): ClusteredEvent[][] {
  const clusteredEvents = clusterEvents(events);

  const lastEventPerLane: (ZetkinEvent | null)[] = [null, null, null];
  const lanes: ClusteredEvent[][] = [[], [], []];

  clusteredEvents.forEach((cluster) => {
    for (let laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
      const lane = lanes[laneIdx];
      const firstInCluster = cluster.events[0];
      const lastEvent = lastEventPerLane[laneIdx];

      if (
        !lastEvent ||
        dayjs(lastEvent.end_time).isBefore(firstInCluster.start_time)
      ) {
        lane.push(cluster);
        lastEventPerLane[laneIdx] = cluster.events[cluster.events.length - 1];
        return;
      }
    }
  });

  return lanes;
}
