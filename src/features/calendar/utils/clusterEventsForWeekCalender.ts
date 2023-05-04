import { clusterEvents } from 'features/campaigns/hooks/useClusteredActivities';
import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import {
  CLUSTER_TYPE,
  ClusteredEvent,
} from 'features/campaigns/hooks/useClusteredActivities';
//import { ZetkinEvent } from 'utils/types/zetkin';

export function doArbitraryClustering(
  events: EventActivity[]
): ClusteredEvent[] {
  const clusteredEvents = clusterEvents(events);
  const clusterTimeSpans: ClusterTimeSpan[] = [];
  for (let i = 0; i < clusteredEvents.length; i++) {
    const activeCluster = clusteredEvents[i];
    let startTime: string;
    let endTime: string;
    if (activeCluster.kind === CLUSTER_TYPE.MULTI_SHIFT) {
      startTime = activeCluster.events[0].start_time;
      endTime = activeCluster.events[activeCluster.events.length - 1].end_time;
    } else {
      startTime = activeCluster.events[0].start_time;
      endTime = activeCluster.events[0].end_time;
    }
    clusterTimeSpans.push({
      endTime,
      startTime,
    });
  }
  return clusteredEvents;
}

export function isEventsOverlaping(
  clusterTimeSpan1: ClusterTimeSpan,
  clusterTimeSpan2: ClusterTimeSpan
): boolean {
  const endTime1 = new Date(clusterTimeSpan1.endTime).getTime();
  const startTime1 = new Date(clusterTimeSpan1.startTime).getTime();
  const startTime2 = new Date(clusterTimeSpan2.startTime).getTime();

  return startTime1 <= startTime2 && endTime1 >= startTime2;
}

type ClusterTimeSpan = {
  endTime: string;
  startTime: string;
};
