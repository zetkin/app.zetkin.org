import {
  CLUSTER_TYPE,
  ClusteredActivity,
  ClusteredEvent,
} from '../hooks/useClusteredActivities';

export default function isEventCluster(
  activity: ClusteredActivity
): activity is ClusteredEvent {
  return (
    activity.kind == CLUSTER_TYPE.SINGLE ||
    activity.kind == CLUSTER_TYPE.MULTI_LOCATION ||
    activity.kind == CLUSTER_TYPE.MULTI_SHIFT
  );
}
