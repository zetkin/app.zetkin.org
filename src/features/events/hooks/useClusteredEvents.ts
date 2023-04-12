import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { ZetkinEvent } from 'utils/types/zetkin';

export enum CLUSTER_TYPE {
  MULTI_LOCATION = 'multilocation',
  MULTI_SHIFT = 'multishift',
  SINGLE = 'single',
}

export type MultiShiftEventCluster = {
  events: ZetkinEvent[];
  type: CLUSTER_TYPE.MULTI_SHIFT;
};

export type MultiLocationEventCluster = {
  events: ZetkinEvent[];
  type: CLUSTER_TYPE.MULTI_LOCATION;
};

export type SingleEvent = {
  events: [ZetkinEvent];
  type: CLUSTER_TYPE.SINGLE;
};

export type ClusteredEvent =
  | MultiLocationEventCluster
  | MultiShiftEventCluster
  | SingleEvent;

function isActivities(
  events: ZetkinEvent[] | EventActivity[]
): events is EventActivity[] {
  const firstEvent = events[0];
  return firstEvent && 'type' in firstEvent;
}

function clusterEvents(events: ZetkinEvent[]): ClusteredEvent[] {
  const sorted = events.concat().sort((a, b) => {
    const aStart = new Date(a.start_time);
    const bStart = new Date(b.start_time);
    const diffStart = aStart.getTime() - bStart.getTime();

    // Primarily sort by start time
    if (diffStart != 0) {
      return diffStart;
    }

    // When start times are identical, sort by end time
    const aEnd = new Date(a.end_time);
    const bEnd = new Date(b.end_time);

    return aEnd.getTime() - bEnd.getTime();
  });

  let allClusters: ClusteredEvent[] = [];
  let pendingClusters: ClusteredEvent[] = [];

  sorted.forEach((event, index) => {
    const lastEvent = sorted[index - 1];

    if (lastEvent?.start_time.slice(0, 10) != event.start_time.slice(0, 10)) {
      // This event is the first of this day, so we can reset all
      // cluster lookups, to speed up future lookups
      allClusters = allClusters.concat(pendingClusters);
      pendingClusters = [];
    }

    for (let i = 0; i < pendingClusters.length; i++) {
      const cluster = pendingClusters[i];
      const lastClusterEvent = cluster.events[cluster.events.length - 1];

      if (cluster.type == CLUSTER_TYPE.SINGLE) {
        if (
          event.activity.id != lastClusterEvent.activity.id ||
          event.title != lastClusterEvent.title
        ) {
          continue;
        }

        if (
          event.location.id == lastClusterEvent.location.id &&
          event.start_time == lastClusterEvent.end_time
        ) {
          pendingClusters[i] = {
            events: [...cluster.events, event],
            type: CLUSTER_TYPE.MULTI_SHIFT,
          };
          return;
        }
      } else if (cluster.type == CLUSTER_TYPE.MULTI_SHIFT) {
        // If activity and location is the same, and this event
        // starts right after the last event in the group ends,
        // the event is part of this cluster.
        if (
          lastClusterEvent.activity.id == event.activity.id &&
          lastClusterEvent.title == event.title &&
          lastClusterEvent.location.id == event.location.id &&
          lastClusterEvent.end_time == event.start_time
        ) {
          pendingClusters[i].events.push(event);
          return;
        }
      }
    }

    // No cluster was found, create new single
    pendingClusters.push({
      events: [event],
      type: CLUSTER_TYPE.SINGLE,
    });
  });

  return allClusters.concat(pendingClusters);
}

export default function useClusteredEvents(
  events: ZetkinEvent[] | EventActivity[]
): ClusteredEvent[] {
  const simpleEvents = isActivities(events)
    ? events.map((activity) => activity.data)
    : events;

  return clusterEvents(simpleEvents);
}
