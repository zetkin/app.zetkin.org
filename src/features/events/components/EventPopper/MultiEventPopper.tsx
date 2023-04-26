import { Box, Paper, Popper } from '@mui/material';
import React, { FC } from 'react';

import { CLUSTER_TYPE } from './MultiEventListItem';
import EventPopperHeader from './EventPopperHeader';
import { EventState } from '../../models/EventDataModel';
import MultiShiftEvent from './MultiShiftEvent';
import { ZetkinEvent } from '../../../../utils/types/zetkin';

interface MultiEventPopperProps {
  anchorEl: HTMLElement | null;
  clusterType: CLUSTER_TYPE;
  events: ZetkinEvent[];
  open: boolean;
  state: EventState;
}

const MultiEventPopper: FC<MultiEventPopperProps> = ({
  anchorEl,
  clusterType,
  events,
  open,
  state,
}) => {
  return (
    <Popper anchorEl={anchorEl} open={open} placement="bottom">
      <Paper sx={{ padding: 2, width: '340px' }}>
        <Box display="flex" flexDirection="column">
          <EventPopperHeader event={events[0]} state={state} />
          {clusterType === CLUSTER_TYPE.SHIFT && (
            <MultiShiftEvent events={events} />
          )}
        </Box>
      </Paper>
    </Popper>
  );
};
export default MultiEventPopper;
