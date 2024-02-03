import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popover,
  Typography,
} from '@mui/material';
import React, { FC, useState } from 'react';

import ArbitraryCluster from './ArbitraryCluster';
import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import messageIds from 'features/events/l10n/messageIds';
import MultiLocationCluster from './MultiLocationCluster';
import MultiLocationIcon from 'zui/icons/MultiLocation';
import MultiShiftCluster from './MultiShiftCluster';
import SingleEvent from '../SingleEvent';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from '../../../../../utils/types/zetkin';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import {
  ArrowBack,
  EventOutlined,
  SplitscreenOutlined,
} from '@mui/icons-material';

export interface MultiEventPopperProps {
  anchorPosition: { left: number; top: number } | undefined;
  clusterType: CLUSTER_TYPE;
  events: ZetkinEvent[];
  onClickAway: () => void;
  open: boolean;
}

const MultiEventPopper: FC<MultiEventPopperProps> = ({
  anchorPosition,
  clusterType,
  events,
  onClickAway,
  open,
}) => {
  const [singleEvent, setSingleEvent] = useState<ZetkinEvent | null>(null);
  const messages = useMessages(messageIds);

  let topRightIcon = <MultiLocationIcon color="secondary" fontSize="small" />;
  let topRightMessage = messages.eventPopper.locations();
  if (clusterType === CLUSTER_TYPE.MULTI_SHIFT) {
    topRightIcon = <SplitscreenOutlined color="secondary" fontSize="small" />;
    topRightMessage = messages.eventPopper.shifts();
  } else if (clusterType === CLUSTER_TYPE.ARBITRARY) {
    topRightIcon = <EventOutlined color="secondary" fontSize="small" />;
    topRightMessage = messages.eventPopper.events();
  }

  return (
    <Popover
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
      open={open}
    >
      <ClickAwayListener
        onClickAway={() => {
          onClickAway();
          setSingleEvent(null);
        }}
      >
        <Paper sx={{ minHeight: '400px', padding: 2, width: '480px' }}>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              justifyContent="space-between"
              paddingBottom={1}
            >
              <Box>
                {!singleEvent && (
                  <Typography color="secondary" variant="h5">
                    {clusterType === CLUSTER_TYPE.MULTI_LOCATION &&
                      messages.eventPopper.multiLocation()}
                    {clusterType === CLUSTER_TYPE.MULTI_SHIFT &&
                      messages.eventPopper.multiShift()}
                    {clusterType === CLUSTER_TYPE.ARBITRARY &&
                      messages.eventPopper.multiEvent()}
                  </Typography>
                )}
                {singleEvent && (
                  <Button
                    onClick={() => setSingleEvent(null)}
                    startIcon={<ArrowBack />}
                  >
                    {clusterType === CLUSTER_TYPE.MULTI_LOCATION &&
                      messages.eventPopper.backToLocations()}
                    {clusterType === CLUSTER_TYPE.MULTI_SHIFT &&
                      messages.eventPopper.backToShifts()}
                    {clusterType === CLUSTER_TYPE.ARBITRARY &&
                      messages.eventPopper.backToEvents()}
                  </Button>
                )}
              </Box>
              <ZUIIconLabel
                color="secondary"
                icon={topRightIcon}
                label={`${events.length} ${topRightMessage}`}
                size="sm"
              />
            </Box>
            {singleEvent && (
              <SingleEvent
                event={singleEvent}
                onClickAway={() => {
                  onClickAway();
                  setSingleEvent(null);
                }}
              />
            )}
            <Box maxHeight="500px" sx={{ overFlowY: 'auto' }}>
              {!singleEvent && clusterType === CLUSTER_TYPE.MULTI_SHIFT && (
                <MultiShiftCluster
                  events={events}
                  onEventClick={(id: number) => {
                    const event = events.find((event) => event.id === id);
                    if (event) {
                      setSingleEvent(event);
                    }
                  }}
                />
              )}
              {!singleEvent && clusterType === CLUSTER_TYPE.MULTI_LOCATION && (
                <MultiLocationCluster
                  events={events}
                  onEventClick={(id: number) => {
                    const event = events.find((event) => event.id === id);
                    if (event) {
                      setSingleEvent(event);
                    }
                  }}
                />
              )}
              {!singleEvent && clusterType === CLUSTER_TYPE.ARBITRARY && (
                <ArbitraryCluster
                  events={events}
                  onEventClick={(id: number) => {
                    const event = events.find((event) => event.id === id);
                    if (event) {
                      setSingleEvent(event);
                    }
                  }}
                />
              )}
            </Box>
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
};
export default MultiEventPopper;
