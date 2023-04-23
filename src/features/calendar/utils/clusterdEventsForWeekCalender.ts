import { ClusteredEvent } from 'features/campaigns/hooks/useClusteredActivities';
import { clusterEvents } from 'features/campaigns/hooks/useClusteredActivities';
import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
//import { ZetkinEvent } from 'utils/types/zetkin';

export function doArbitraryClustering(
  events: EventActivity[]
): ClusteredEvent[] {
  const clusteredEvents = clusterEvents(events);
  return clusteredEvents;
}
