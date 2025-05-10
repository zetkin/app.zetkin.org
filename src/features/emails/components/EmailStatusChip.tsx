import { Box } from '@mui/material';
import { FC } from 'react';
import { makeStyles } from '@mui/styles';

import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import oldTheme from 'theme';

interface EmailStatusChipProps {
  state: EmailState;
}

const useStyles = makeStyles(() => ({
  chip: {
    alignItems: 'center',
    borderRadius: '2em',
    color: 'white',
    display: 'inline-flex',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '0.5em 0.7em',
  },
  draft: {
    backgroundColor: oldTheme.palette.grey[500],
  },
  scheduled: {
    backgroundColor: oldTheme.palette.statusColors.blue,
  },
  sent: {
    backgroundColor: oldTheme.palette.success.main,
  },
}));

const EmailStatusChip: FC<EmailStatusChipProps> = ({ state }) => {
  const classes = useStyles();

  if (state == EmailState.UNKNOWN) {
    return null;
  }

  const classMap: Record<EmailState, string> = {
    [EmailState.DRAFT]: classes.draft,
    [EmailState.UNKNOWN]: classes.draft,
    [EmailState.SENT]: classes.sent,
    [EmailState.SCHEDULED]: classes.scheduled,
  };

  const colorClassName = classMap[state];

  return (
    <Box className={`${colorClassName} ${classes.chip}`}>
      <Msg id={messageIds.state[state]} />
    </Box>
  );
};

export default EmailStatusChip;
