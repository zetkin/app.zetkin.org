import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, CircularProgress, makeStyles } from '@material-ui/core';

import { CallAssignmentState } from '../models/CallAssignmentModel';

interface CallAssignmentStatusChipProps {
  state: CallAssignmentState;
}

const useStyles = makeStyles((theme) => ({
  chip: {
    alignItems: 'center',
    borderRadius: '2em',
    color: 'white',
    display: 'inline-flex',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '0.5em 0.7em',
  },
  closed: {
    backgroundColor: theme.palette.error.main,
  },
  draft: {
    backgroundColor: theme.palette.grey[500],
  },
  open: {
    backgroundColor: theme.palette.success.main,
  },
  scheduled: {
    backgroundColor: theme.palette.targetingStatusBar.blue,
  },
  spinner: {
    marginLeft: '0.5em',
  },
}));

const CallAssignmentStatusChip: FC<CallAssignmentStatusChipProps> = ({
  state,
}) => {
  const classes = useStyles();

  if (state == CallAssignmentState.UNKNOWN) {
    return null;
  }

  const classMap: Record<CallAssignmentState, string> = {
    [CallAssignmentState.ACTIVE]: classes.open,
    [CallAssignmentState.CLOSED]: classes.closed,
    [CallAssignmentState.DRAFT]: classes.draft,
    [CallAssignmentState.OPEN]: classes.open,
    [CallAssignmentState.SCHEDULED]: classes.scheduled,
    [CallAssignmentState.UNKNOWN]: classes.draft,
  };

  const colorClassName = classMap[state];

  return (
    <Box className={`${colorClassName} ${classes.chip}`}>
      <FormattedMessage id={`pages.organizeCallAssignment.state.${state}`} />
      {state == CallAssignmentState.ACTIVE && (
        <CircularProgress
          className={classes.spinner}
          size={14}
          style={{ color: 'white' }}
        />
      )}
    </Box>
  );
};

export default CallAssignmentStatusChip;
