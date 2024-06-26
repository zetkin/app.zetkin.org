import { FC } from 'react';
import Image from 'next/image';
import { Box, ClickAwayListener, Paper, Popover } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import SingleEvent from './SingleEvent';
import { useMessages } from 'core/i18n';
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
  const messages = useMessages(messageIds);
  return (
    <Popover
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
      open={open}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <Paper sx={{ width: '480px' }}>
          {event.cover_file && (
            <Box height={120} position="relative">
              <Image
                alt={
                  event.title ||
                  event.activity?.title ||
                  messages.common.noTitle()
                }
                fill
                src={event.cover_file.url}
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}
          <Box p={2}>
            <SingleEvent event={event} onClickAway={onClickAway} />
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
};

export default SingleEventPopper;
