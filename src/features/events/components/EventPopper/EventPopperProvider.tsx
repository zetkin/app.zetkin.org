import { createContext, FC, ReactNode, useContext, useState } from 'react';

import { CLUSTER_TYPE } from './MultiEventPopper/MultiEventListItem';
import MultiEventPopper from './MultiEventPopper';
import SingleEventPopper from './SingleEventPopper';
import { ZetkinEvent } from 'utils/types/zetkin';

type EventPopperContextData = {
  openMultiEventPopper: (
    clusterType: CLUSTER_TYPE,
    cursorPosition: { left: number; top: number },
    events: ZetkinEvent[]
  ) => void;
  openSingleEventPopper: (
    cursorPosition: { left: number; top: number },
    event: ZetkinEvent
  ) => void;
};

const EventPopperContext = createContext<EventPopperContextData>({
  openMultiEventPopper: () => null,
  openSingleEventPopper: () => null,
});

type EventPopperPropviderProps = {
  children: ReactNode;
};

export const EventPopperProvider: FC<EventPopperPropviderProps> = ({
  children,
}) => {
  const [multiAnchorPosition, setMultiAnchorPosition] =
    useState<{ left: number; top: number }>();
  const [singleAnchorPosition, setSingleAnchorPosition] =
    useState<{ left: number; top: number }>();
  const [event, setEvent] = useState<ZetkinEvent>();
  const [events, setEvents] = useState<ZetkinEvent[]>();
  const [clusterType, setClusterType] = useState<CLUSTER_TYPE>(
    CLUSTER_TYPE.ARBITRARY
  );

  return (
    <EventPopperContext.Provider
      value={{
        openMultiEventPopper: (clusterType, cursorPosition, events) => {
          setClusterType(clusterType);
          setMultiAnchorPosition(cursorPosition);
          setEvents(events);
          setSingleAnchorPosition(undefined);
        },
        openSingleEventPopper: (cursorPosition, event) => {
          setSingleAnchorPosition(cursorPosition);
          setEvent(event);
          setMultiAnchorPosition(undefined);
        },
      }}
    >
      {!!event && (
        <SingleEventPopper
          anchorPosition={singleAnchorPosition}
          event={event}
          onClickAway={() => setSingleAnchorPosition(undefined)}
          open={!!singleAnchorPosition}
        />
      )}
      {!!events && (
        <MultiEventPopper
          anchorPosition={multiAnchorPosition}
          clusterType={clusterType}
          events={events}
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
