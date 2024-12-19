import isEventCluster from '../utils/isEventCluster';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  ACTIVITIES,
  CallAssignmentActivity,
  CampaignActivity,
  CanvassAssignmentActivity,
  EmailActivity,
  EventActivity,
  SurveyActivity,
  TaskActivity,
} from '../types';
import sortEventsByStartTime from 'features/events/utils/sortEventsByStartTime';

export enum CLUSTER_TYPE {
  MULTI_LOCATION = 'multilocation',
  MULTI_SHIFT = 'multishift',
  SINGLE = 'single',
  ARBITRARY = 'arbitrary',
}

export type MultiShiftEventCluster = {
  events: ZetkinEvent[];
  kind: CLUSTER_TYPE.MULTI_SHIFT;
};

export type MultiLocationEventCluster = {
  events: ZetkinEvent[];
  kind: CLUSTER_TYPE.MULTI_LOCATION;
};

export type SingleEvent = {
  events: [ZetkinEvent];
  kind: CLUSTER_TYPE.SINGLE;
};

export type ClusteredEvent =
  | MultiLocationEventCluster
  | MultiShiftEventCluster
  | SingleEvent;

export type NonEventActivity =
  | CallAssignmentActivity
  | CanvassAssignmentActivity
  | SurveyActivity
  | TaskActivity
  | EmailActivity;
export type ClusteredActivity = ClusteredEvent | NonEventActivity;

export function clusterEvents(
  eventActivities: EventActivity[]
): ClusteredEvent[] {
  const sortedEvents = eventActivities
    .map((activity) => activity.data)
    .sort(sortEventsByStartTime);

  let allClusters: ClusteredEvent[] = [];
  let pendingClusters: ClusteredEvent[] = [];

  sortedEvents.forEach((event, index) => {
    const lastEvent = sortedEvents[index - 1];

    if (lastEvent?.start_time.slice(0, 10) != event.start_time.slice(0, 10)) {
      // This event is the first of this day, so we can reset all
      // cluster lookups, to speed up future lookups
      allClusters = allClusters.concat(pendingClusters);
      pendingClusters = [];
    }

    for (let i = 0; i < pendingClusters.length; i++) {
      const cluster = pendingClusters[i];
      const lastClusterEvent = cluster.events[cluster.events.length - 1];
      const lastClusterEventTitle = lastClusterEvent.title || '';
      const eventTitle = event.title || '';

      if (cluster.kind == CLUSTER_TYPE.SINGLE) {
        if (
          event.activity?.id != lastClusterEvent.activity?.id ||
          eventTitle != lastClusterEventTitle
        ) {
          continue;
        }

        if (
          event.location?.id == lastClusterEvent.location?.id &&
          event.start_time == lastClusterEvent.end_time
        ) {
          pendingClusters[i] = {
            events: [...cluster.events, event],
            kind: CLUSTER_TYPE.MULTI_SHIFT,
          };
          return;
        }

        if (doesMultipleLocationEventsMatch(lastClusterEvent, event)) {
          pendingClusters[i] = {
            events: [...cluster.events, event],
            kind: CLUSTER_TYPE.MULTI_LOCATION,
          };
          return;
        }
      } else if (cluster.kind == CLUSTER_TYPE.MULTI_SHIFT) {
        // If activity and location is the same, and this event
        // starts right after the last event in the group ends,
        // the event is part of this cluster.
        if (
          lastClusterEvent.activity?.id == event.activity?.id &&
          lastClusterEventTitle == eventTitle &&
          lastClusterEvent.location?.id == event.location?.id &&
          lastClusterEvent.end_time == event.start_time
        ) {
          pendingClusters[i].events.push(event);
          return;
        }
      } else if (cluster.kind == CLUSTER_TYPE.MULTI_LOCATION) {
        if (doesMultipleLocationEventsMatch(lastClusterEvent, event)) {
          pendingClusters[i].events.push(event);
          return;
        }
      }
    }

    // No cluster was found, create new single
    pendingClusters.push({
      events: [event],
      kind: CLUSTER_TYPE.SINGLE,
    });
  });

  return allClusters.concat(pendingClusters);
}

export default function useClusteredActivities(
  activities: CampaignActivity[]
): ClusteredActivity[] {
  const eventActivities: EventActivity[] = [];
  const otherActivities: NonEventActivity[] = [];

  activities.forEach((activity) => {
    if (activity.kind == ACTIVITIES.EVENT) {
      eventActivities.push(activity);
    } else {
      otherActivities.push(activity);
    }
  });

  const clusteredEvents: ClusteredActivity[] = clusterEvents(eventActivities);

  return clusteredEvents.concat(otherActivities).sort((a, b) => {
    const aStart = isEventCluster(a)
      ? new Date(a.events[0].start_time)
      : a.visibleFrom;
    const bStart = isEventCluster(b)
      ? new Date(b.events[0].start_time)
      : b.visibleFrom;

    if (!aStart && !bStart) {
      return 0;
    } else if (!aStart) {
      return -1;
    } else if (!bStart) {
      return 1;
    }

    return aStart.getTime() - bStart.getTime();
  });
}

function doesMultipleLocationEventsMatch(
  event1: ZetkinEvent,
  event2: ZetkinEvent
): boolean {
  return (
    !!event1.location &&
    !!event2.location &&
    event1.location.id !== event2.location.id &&
    event1.activity?.id === event2?.activity?.id &&
    event1.campaign?.id === event2?.campaign?.id &&
    event1.start_time === event2?.start_time &&
    event1.end_time === event2?.end_time &&
    event1.organization.id === event2?.organization.id
  );
}
