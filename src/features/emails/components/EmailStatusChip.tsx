import { Box, SxProps } from '@mui/material';
import { FC, useMemo } from 'react';

import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import oldTheme from 'theme';

interface EmailStatusChipProps {
  state: EmailState;
}

const EmailStatusChip: FC<EmailStatusChipProps> = ({ state }) => {
  const chipStyles: SxProps = useMemo(() => {
    return {
      alignItems: 'center',
      borderRadius: '2em',
      color: 'white',
      display: 'inline-flex',
      fontSize: 14,
      fontWeight: 'bold',
      padding: '0.5em 0.7em',
      ...{
        [EmailState.DRAFT]: {
          backgroundColor: oldTheme.palette.grey[500],
        },
        [EmailState.UNKNOWN]: {
          backgroundColor: oldTheme.palette.grey[500],
        },
        [EmailState.SENT]: {
          backgroundColor: oldTheme.palette.success.main,
        },
        [EmailState.SCHEDULED]: {
          backgroundColor: oldTheme.palette.statusColors.blue,
        },
      }[state],
    };
  }, [state]);

  if (state == EmailState.UNKNOWN) {
    return null;
  }

  return (
    <Box sx={chipStyles}>
      <Msg id={messageIds.state[state]} />
    </Box>
  );
};

export default EmailStatusChip;
