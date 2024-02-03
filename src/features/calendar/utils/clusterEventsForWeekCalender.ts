import dayjs from 'dayjs';

import { clusterEvents } from 'features/campaigns/hooks/useClusteredActivities';
import { EventActivity } from 'features/campaigns/types';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  CLUSTER_TYPE,
  ClusteredEvent,
} from 'features/campaigns/hooks/useClusteredActivities';

type ArbitraryEventCluster = {
  events: ZetkinEvent[];
  kind: CLUSTER_TYPE.ARBITRARY;
};

export type AnyClusteredEvent = ClusteredEvent | ArbitraryEventCluster;

export default function clusterEventsForWeekCalender(
  events: EventActivity[]
): AnyClusteredEvent[][] {
  const clusteredEvents = clusterEvents(events);

  const lastEventPerLane: (ZetkinEvent | null)[] = [null, null, null];
  const lanes: AnyClusteredEvent[][] = [[], [], []];

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

    // If it got this far, we couldn't find a lane, so events must be
    // merged into the last lane
    const lastLaneIndex = lanes.length - 1;
    const lastLane = lanes[lastLaneIndex];
    const lastCluster = lastLane.pop();

    const newLastCluster: ArbitraryEventCluster = {
      events: [...(lastCluster?.events ?? []), ...cluster.events],
      kind: CLUSTER_TYPE.ARBITRARY,
    };

    lastLane.push(newLastCluster);
  });

  return lanes;
}
