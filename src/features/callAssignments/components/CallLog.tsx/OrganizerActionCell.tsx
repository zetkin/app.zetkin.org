import { Box, Button, Paper, Popper, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { Check, PriorityHigh } from '@mui/icons-material';

import useCall from 'features/callAssignments/hooks/useCall';
import useToggleDebounce from 'utils/hooks/useToggleDebounce';
import oldTheme from 'theme';
import { Msg } from 'core/i18n';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import messageIds from 'features/callAssignments/l10n/messageIds';
import { Call } from 'features/callAssignments/apiTypes';

type Props = {
  call: Call;
  orgId: number;
};

const OrganizerActionCell: FC<Props> = ({ call, orgId }) => {
  const updateCall = useCall();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { open: openPopper, close: closePopper } = useToggleDebounce(
    (ev) => setAnchorEl(ev.currentTarget),
    () => setAnchorEl(null)
  );

  if (!call.organizer_action_needed) {
    return null;
  }

  return (
    <Box
      onMouseOut={closePopper}
      onMouseOver={openPopper}
      sx={{
        alignItems: 'center',
        backgroundColor: call.organizer_action_taken
          ? 'transparent'
          : oldTheme.palette.statusColors.orange,
        cursor: 'pointer',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {call.organizer_action_taken ? <Check /> : <PriorityHigh />}
      <Popper
        anchorEl={anchorEl}
        open={!!anchorEl}
        popperOptions={{ placement: 'left' }}
        sx={{ width: 300 }}
      >
        <Paper elevation={2}>
          <Stack sx={{ alignItems: 'flex-start', gap: 1, padding: 2 }}>
            <Typography variant="h5">
              <Msg id={messageIds.calls.organizerActionNeeded.title} />
            </Typography>
            <Box>
              <Typography color="secondary">
                <ZUIRelativeTime datetime={call.update_time} />
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {call.message_to_organizer}
              </Typography>
            </Box>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await updateCall(orgId, call.id, {
                  organizer_action_taken: !call.organizer_action_taken,
                });
                setLoading(false);
              }}
              startIcon={
                call.organizer_action_taken ? <PriorityHigh /> : <Check />
              }
              variant={call.organizer_action_taken ? 'text' : 'contained'}
            >
              <Msg
                id={
                  messageIds.calls.organizerActionNeeded[
                    call.organizer_action_taken ? 'unsolve' : 'solve'
                  ]
                }
              />
            </Button>
          </Stack>
        </Paper>
      </Popper>
    </Box>
  );
};

export default OrganizerActionCell;
