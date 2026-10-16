import { FC, useState } from 'react';
import { Box, Button, Paper, Popper, Stack, Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import useCall from 'features/callAssignments/hooks/useCall';
import messageIds from 'features/callAssignments/l10n/messageIds';
import useToggleDebounce from 'utils/hooks/useToggleDebounce';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { ZetkinCall } from 'features/call/types';

type Props = {
  call: ZetkinCall;
  orgId: number;
};

const CallerNoteCell: FC<Props> = ({ call, orgId }) => {
  const [loading, setLoading] = useState(false);
  const updateCall = useCall();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { open: openPopper, close: closePopper } = useToggleDebounce(
    (ev) => setAnchorEl(ev.currentTarget),
    () => setAnchorEl(null)
  );

  const note = call.notes;

  return (
    <Box
      onMouseOut={closePopper}
      onMouseOver={openPopper}
      sx={{
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        cursor: 'pointer',
        display: '-webkit-box',
        maxHeight: '100%',
        overflow: 'hidden',
        whiteSpace: 'normal',
        width: '100%',
      }}
    >
      {note}
      <Popper
        anchorEl={anchorEl}
        open={!!anchorEl}
        popperOptions={{ placement: 'left' }}
        sx={{ width: 300 }}
      >
        <Paper elevation={2}>
          <Stack sx={{ alignItems: 'flex-start', gap: 1, padding: 2 }}>
            <Typography variant="h5">
              <Msg id={messageIds.calls.callerNote.title} />
            </Typography>
            <Box>
              <Typography color="secondary">
                <ZUIRelativeTime datetime={call.update_time} />
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{note}</Typography>
            </Box>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await updateCall(orgId, call.id, {
                  notes: null,
                });
                setLoading(false);
              }}
            >
              <Msg id={messageIds.calls.callerNote.delete} />
            </Button>
          </Stack>
        </Paper>
      </Popper>
    </Box>
  );
};

export default CallerNoteCell;
