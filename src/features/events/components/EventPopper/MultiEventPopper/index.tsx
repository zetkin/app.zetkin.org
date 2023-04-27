import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import React, { FC, useState } from 'react';

import { CLUSTER_TYPE } from './MultiEventListItem';
import messageIds from 'features/events/l10n/messageIds';
import MultiLocationCluster from './MultiLocationCluster';
import MultiLocationIcon from 'zui/icons/MultiLocation';
import MultiShiftCluster from './MultiShiftCluster';
import SingleEvent from './SingleEvent';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from '../../../../../utils/types/zetkin';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import { ArrowBack, SplitscreenOutlined } from '@mui/icons-material';

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
  if (clusterType === CLUSTER_TYPE.LOCATION) {
    topRightIcon = <SplitscreenOutlined color="secondary" fontSize="small" />;
  }

  return (
    <Popper anchorEl={anchorEl} open={open} placement="right">
      <ClickAwayListener
        onClickAway={() => {
          onClickAway();
          setSingleEvent(null);
        }}
      >
        <Paper sx={{ padding: 2, width: '340px' }}>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              justifyContent="space-between"
              paddingBottom={1}
            >
              <Box>
                {!singleEvent && (
                  <Typography variant="h5">
                    {clusterType === CLUSTER_TYPE.LOCATION
                      ? messages.eventPopper.multiLocation()
                      : messages.eventPopper.multiShift()}
                  </Typography>
                )}
                {singleEvent && (
                  <Button
                    onClick={() => setSingleEvent(null)}
                    startIcon={<ArrowBack />}
                  >
                    {clusterType === CLUSTER_TYPE.SHIFT &&
                      messages.eventPopper.backToShifts()}
                    {clusterType === CLUSTER_TYPE.LOCATION &&
                      messages.eventPopper.backToLocations()}
                  </Button>
                )}
              </Box>
              <ZUIIconLabel
                color="secondary"
                icon={topRightIcon}
                label={`${events.length} ${
                  clusterType === CLUSTER_TYPE.LOCATION
                    ? messages.eventPopper.locations()
                    : messages.eventPopper.shifts()
                }`}
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
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
export default MultiEventPopper;
