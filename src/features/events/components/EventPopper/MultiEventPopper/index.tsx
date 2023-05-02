import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import React, { FC, useState } from 'react';

import ArbitraryCluster from './ArbitraryCluster';
import { CLUSTER_TYPE } from './MultiEventListItem';
import messageIds from 'features/events/l10n/messageIds';
import MultiLocationCluster from './MultiLocationCluster';
import MultiLocationIcon from 'zui/icons/MultiLocation';
import MultiShiftCluster from './MultiShiftCluster';
import SingleEvent from './SingleEvent';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from '../../../../../utils/types/zetkin';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import {
  ArrowBack,
  EventOutlined,
  SplitscreenOutlined,
} from '@mui/icons-material';

interface MultiEventPopperProps {
  anchorEl: HTMLElement | null;
  clusterType: CLUSTER_TYPE;
  events: ZetkinEvent[];
  onClickAway: () => void;
  open: boolean;
}

const MultiEventPopper: FC<MultiEventPopperProps> = ({
  anchorEl,
  clusterType,
  events,
  onClickAway,
  open,
}) => {
  const [singleEvent, setSingleEvent] = useState<ZetkinEvent | null>(null);
  const messages = useMessages(messageIds);

  let topRightIcon = <MultiLocationIcon color="secondary" fontSize="small" />;
  let topRightMessage = messages.eventPopper.locations();
  if (clusterType === CLUSTER_TYPE.SHIFT) {
    topRightIcon = <SplitscreenOutlined color="secondary" fontSize="small" />;
    topRightMessage = messages.eventPopper.shifts();
  } else if (clusterType === CLUSTER_TYPE.ARBITRARY) {
    topRightIcon = <EventOutlined color="secondary" fontSize="small" />;
    topRightMessage = messages.eventPopper.events();
  }

  return (
    <Popper
      anchorEl={anchorEl}
      open={open}
      placement="right"
      sx={{ width: '480px' }}
    >
      <ClickAwayListener
        onClickAway={() => {
          onClickAway();
          setSingleEvent(null);
        }}
      >
        <Paper sx={{ padding: 2 }}>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              justifyContent="space-between"
              paddingBottom={1}
            >
              <Box>
                {!singleEvent && (
                  <Typography color="secondary" variant="h5">
                    {clusterType === CLUSTER_TYPE.LOCATION &&
                      messages.eventPopper.multiLocation()}
                    {clusterType === CLUSTER_TYPE.SHIFT &&
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
                    {clusterType === CLUSTER_TYPE.LOCATION &&
                      messages.eventPopper.backToLocations()}
                    {clusterType === CLUSTER_TYPE.SHIFT &&
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
                onCancel={() => null}
                onDelete={() => null}
                onPublish={() => null}
              />
            )}
            <Box maxHeight="500px" overflow="scroll">
              {!singleEvent && clusterType === CLUSTER_TYPE.SHIFT && (
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
              {!singleEvent && clusterType === CLUSTER_TYPE.LOCATION && (
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
    </Popper>
  );
};
export default MultiEventPopper;
