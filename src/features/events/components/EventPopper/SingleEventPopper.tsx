import { FC } from 'react';
import { ClickAwayListener, Paper, Popover } from '@mui/material';

import SingleEvent from './SingleEvent';
import { ZetkinEvent } from 'utils/types/zetkin';

export interface SingleEventPopperProps {
  anchorPosition: { left: number; top: number } | undefined;
  event: ZetkinEvent;
  onClickAway: () => void;
  open: boolean;
}

const SingleEventPopper: FC<SingleEventPopperProps> = ({
  anchorPosition,
  event,
  onClickAway,
  open,
}) => {
  return (
    <Popover
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
      open={open}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <Paper sx={{ padding: 2, width: '480px' }}>
          <SingleEvent event={event} onClickAway={onClickAway} />
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
};

export default SingleEventPopper;
