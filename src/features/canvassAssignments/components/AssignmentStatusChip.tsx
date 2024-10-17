import { FC } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { CanvassAssignmentState } from '../hooks/useCanvassAssignmentStatus';

interface AssigmentStatusChipProps {
  state: CanvassAssignmentState;
}

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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
    backgroundColor: theme.palette.statusColors.blue,
  },
}));

const AssignmentStatusChip: FC<AssigmentStatusChipProps> = ({ state }) => {
  const classes = useStyles();

  const classMap: Record<CanvassAssignmentState, string> = {
    [CanvassAssignmentState.CLOSED]: classes.closed,
    [CanvassAssignmentState.OPEN]: classes.open,
    [CanvassAssignmentState.SCHEDULED]: classes.scheduled,
    [CanvassAssignmentState.UNKNOWN]: classes.draft,
    [CanvassAssignmentState.DRAFT]: classes.draft,
  };

  const colorClassName = classMap[state];

  return (
    <Box className={`${colorClassName} ${classes.chip}`}>
      {capitalizeFirstLetter(state)}
    </Box>
  );
};

export default AssignmentStatusChip;
