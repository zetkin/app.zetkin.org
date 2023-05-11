import { FC } from 'react';

import { AnyClusteredEvent } from 'features/calendar/utils/clusterEventsForWeekCalender';
import Arbitrary from './Arbitrary';
import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import MultiLocation from './MultiLocation';
import MultiShift from './MultiShift';
import Single from './Single';
import useEventClusterData from 'features/events/hooks/useEventClusterData';

type EventClusterProps = {
  cluster: AnyClusteredEvent;
  height: number;
};

const EventCluster: FC<EventClusterProps> = ({ cluster, height }) => {
  const { numReminded, numPending, numBooked } = useEventClusterData(cluster);
  const remindersNotSent = numBooked - numReminded;

  return (
    <>
      {cluster.kind == CLUSTER_TYPE.SINGLE && (
        <Single
          event={cluster.events[0]}
          height={height}
          remindersNotSent={remindersNotSent}
          unbookedSignups={numPending}
          width={'100%'}
        />
      )}
      {cluster.kind == CLUSTER_TYPE.MULTI_LOCATION && (
        <MultiLocation
          events={cluster.events}
          height={height}
          remindersNotSent={remindersNotSent}
          unbookedSignups={numPending}
          width="100%"
        />
      )}
      {cluster.kind == CLUSTER_TYPE.MULTI_SHIFT && (
        <MultiShift
          events={cluster.events}
          height={height}
          remindersNotSent={remindersNotSent}
          unbookedSignups={numPending}
          width="100%"
        />
      )}
      {cluster.kind == CLUSTER_TYPE.ARBITRARY && (
        <Arbitrary
          events={cluster.events}
          height={height}
          remindersNotSent={remindersNotSent}
          unbookedSignups={numPending}
          width="100%"
        />
      )}
    </>
  );
};
export default EventCluster;
