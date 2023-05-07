import { createContext, FC, ReactNode, useContext, useState } from 'react';

import MultiEventPopper from './MultiEventPopper';
import SingleEventPopper from './SingleEventPopper';
import {
  CLUSTER_TYPE,
  ClusteredEvent,
} from 'features/campaigns/hooks/useClusteredActivities';

type EventPopperContextData = {
  openEventPopper: (
    cluster: ClusteredEvent,
    cursorPosition: { left: number; top: number }
  ) => void;
};

const EventPopperContext = createContext<EventPopperContextData>({
  openEventPopper: () => null,
});

type EventPopperPropviderProps = {
  children: ReactNode;
};

export const EventPopperProvider: FC<EventPopperPropviderProps> = ({
  children,
}) => {
  const [multiAnchorPosition, setMultiAnchorPosition] = useState<{
    left: number;
    top: number;
  }>();
  const [singleAnchorPosition, setSingleAnchorPosition] = useState<{
    left: number;
    top: number;
  }>();
  const [cluster, setCluster] = useState<ClusteredEvent | null>(null);

  return (
    <EventPopperContext.Provider
      value={{
        openEventPopper: (cluster, cursorPosition) => {
          setCluster(cluster);
          if (cluster.kind === CLUSTER_TYPE.SINGLE) {
            setSingleAnchorPosition(cursorPosition);
            setMultiAnchorPosition(undefined);
          } else if (
            cluster.kind == CLUSTER_TYPE.MULTI_LOCATION ||
            cluster.kind == CLUSTER_TYPE.MULTI_SHIFT
          ) {
            setMultiAnchorPosition(cursorPosition);
            setSingleAnchorPosition(undefined);
          }
        },
      }}
    >
      {cluster && cluster.kind === CLUSTER_TYPE.SINGLE && (
        <SingleEventPopper
          anchorPosition={singleAnchorPosition}
          event={cluster.events[0]}
          onClickAway={() => setSingleAnchorPosition(undefined)}
          open={!!singleAnchorPosition}
        />
      )}
      {cluster && cluster.kind !== CLUSTER_TYPE.SINGLE && (
        <MultiEventPopper
          anchorPosition={multiAnchorPosition}
          clusterType={cluster.kind}
          events={cluster.events}
          onClickAway={() => setMultiAnchorPosition(undefined)}
          open={!!multiAnchorPosition}
        />
      )}
      {children}
    </EventPopperContext.Provider>
  );
};

export function useEventPopper() {
  return useContext(EventPopperContext);
}
