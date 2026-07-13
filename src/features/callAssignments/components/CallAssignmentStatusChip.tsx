import { FC } from 'react';
import { Box } from '@mui/material';

import { CallAssignmentState } from '../hooks/useCallAssignmentState';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import oldTheme from 'theme';

interface CallAssignmentStatusChipProps {
  state: CallAssignmentState;
}

const CallAssignmentStatusChip: FC<CallAssignmentStatusChipProps> = ({
  state,
}) => {
  if (state == CallAssignmentState.UNKNOWN) {
    return null;
  }

  const colors: Record<CallAssignmentState, string> = {
    [CallAssignmentState.ACTIVE]: oldTheme.palette.success.main,
    [CallAssignmentState.CLOSED]: oldTheme.palette.error.main,
    [CallAssignmentState.DRAFT]: oldTheme.palette.grey[500],
    [CallAssignmentState.OPEN]: oldTheme.palette.success.main,
    [CallAssignmentState.SCHEDULED]: oldTheme.palette.statusColors.blue,
    [CallAssignmentState.UNKNOWN]: oldTheme.palette.grey[500],
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: colors[state],
        borderRadius: '2em',
        color: 'white',
        display: 'inline-flex',
        fontSize: 14,
        fontWeight: 'bold',
        padding: '0.5em 0.7em',
      }}
    >
      <Msg id={messageIds.state[state]} />
    </Box>
  );
};

export default CallAssignmentStatusChip;
