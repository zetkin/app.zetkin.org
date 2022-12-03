import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Chip, makeStyles } from '@material-ui/core';

import { CallAssignmentState } from '../models/CallAssignmentModel';

interface CallAssignmentStatusChipProps {
  state: CallAssignmentState;
}

const useStyles = makeStyles((theme) => ({
  closed: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    fontWeight: 'bold',
  },
  draft: {
    backgroundColor: theme.palette.grey[500],
    color: 'white',
    fontWeight: 'bold',
  },
  open: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 'bold',
  },
  scheduled: {
    backgroundColor: theme.palette.targetingStatusBar.blue,
    color: 'white',
    fontWeight: 'bold',
  },
}));

const CallAssignmentStatusChip: FC<CallAssignmentStatusChipProps> = ({
  state,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  if (state == CallAssignmentState.UNKNOWN) {
    return null;
  }

  const classMap: Record<CallAssignmentState, string> = {
    [CallAssignmentState.CLOSED]: classes.closed,
    [CallAssignmentState.DRAFT]: classes.draft,
    [CallAssignmentState.OPEN]: classes.open,
    [CallAssignmentState.SCHEDULED]: classes.scheduled,
    [CallAssignmentState.UNKNOWN]: classes.draft,
  };

  const className = classMap[state];

  return (
    <Chip
      className={className}
      label={intl.formatMessage({
        id: `pages.organizeCallAssignment.state.${state}`,
      })}
    />
  );
};

export default CallAssignmentStatusChip;
