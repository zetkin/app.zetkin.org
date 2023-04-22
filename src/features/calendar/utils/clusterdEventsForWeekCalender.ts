import cluster from 'cluster';
import { log } from 'console';
import { CLUSTER_TYPE, ClusteredEvent, clusterEvents } from 'features/campaigns/hooks/useClusteredActivities';
import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { ZetkinEvent } from 'utils/types/zetkin';

export function clusterEventsforWeekCalander(eventActivities: EventActivity[]): ClusteredEvent[] {
    const clusteredEvents = clusterEvents(eventActivities)

    let allClusters: ClusteredEvent[] = [];
    let pendingClusters: ClusteredEvent[] = [];
    const singleEvents = clusteredEvents.flatMap((event) => {
        if (event.kind === CLUSTER_TYPE.SINGLE) {
            return event.events
        } else {
            return []
        }
    })


    singleEvents.forEach((event, index) => {
        for (let i = 0; i < pendingClusters.length; i++) {
            const cluster = pendingClusters[i]
            if (cluster.events.filter(e => {
                return doesEventsMatch(e, event)
            }).length != 0) {
                pendingClusters[i] = {
                    events: [...cluster.events, event],
                    kind: CLUSTER_TYPE.MULTI_LOCATION
                }
                return;
            }
        }


        const lastEvent = singleEvents[index - 1]
        if (doesEventsMatch(event, lastEvent)) {
            pendingClusters.push({
                events: [lastEvent, event],
                kind: CLUSTER_TYPE.MULTI_LOCATION
            })
        } else {
            pendingClusters.push({
                events: [event],
                kind: CLUSTER_TYPE.SINGLE
            })
        }
    });

    return pendingClusters
}

function doesEventsMatch(event1: ZetkinEvent, event2: ZetkinEvent): boolean {
    return (event1.activity === event2?.activity &&
        event1.campaign === event2?.campaign &&
        event1.start_time === event2?.start_time &&
        event1.end_time === event2?.end_time &&
        event1.organization === event2?.organization)
}