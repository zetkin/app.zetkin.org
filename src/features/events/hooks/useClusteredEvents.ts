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

export default function useClusteredEvents(
  events: ZetkinEvent[] | EventActivity[]
): ClusteredEvent[] {
  const simpleEvents = isActivities(events)
    ? events.map((activity) => activity.data)
    : events;

  return simpleEvents.map((event) => ({
    events: [event],
    type: CLUSTER_TYPE.SINGLE,
  }));
}
