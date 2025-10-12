import { FC } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { HouseholdAssignmentState } from '../hooks/useHouseholdAssignmentStatus';
import oldTheme from 'theme';

interface AssigmentStatusChipProps {
  state: HouseholdAssignmentState;
}

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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
  closed: {
    backgroundColor: oldTheme.palette.error.main,
  },
  draft: {
    backgroundColor: oldTheme.palette.grey[500],
  },
  open: {
    backgroundColor: oldTheme.palette.success.main,
  },
  scheduled: {
    backgroundColor: oldTheme.palette.statusColors.blue,
  },
}));

const AssignmentStatusChip: FC<AssigmentStatusChipProps> = ({ state }) => {
  const classes = useStyles();

  const classMap: Record<HouseholdAssignmentState, string> = {
    [HouseholdAssignmentState.CLOSED]: classes.closed,
    [HouseholdAssignmentState.OPEN]: classes.open,
    [HouseholdAssignmentState.SCHEDULED]: classes.scheduled,
    [HouseholdAssignmentState.UNKNOWN]: classes.draft,
    [HouseholdAssignmentState.DRAFT]: classes.draft,
  };

  const colorClassName = classMap[state];

  return (
    <Box className={`${colorClassName} ${classes.chip}`}>
      {capitalizeFirstLetter(state)}
    </Box>
  );
};

export default AssignmentStatusChip;
