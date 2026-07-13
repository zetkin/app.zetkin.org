import { FC } from 'react';
import { Box } from '@mui/material';

import { AreaAssignmentState } from '../hooks/useAreaAssignmentStatus';
import oldTheme from 'theme';

interface AssigmentStatusChipProps {
  state: AreaAssignmentState;
}

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const AssignmentStatusChip: FC<AssigmentStatusChipProps> = ({ state }) => {
  const bgColorMap: Record<AreaAssignmentState, string> = {
    [AreaAssignmentState.CLOSED]: oldTheme.palette.error.main,
    [AreaAssignmentState.DRAFT]: oldTheme.palette.grey[500],
    [AreaAssignmentState.OPEN]: oldTheme.palette.success.main,
    [AreaAssignmentState.SCHEDULED]: oldTheme.palette.statusColors.blue,
    [AreaAssignmentState.UNKNOWN]: oldTheme.palette.grey[500],
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: bgColorMap[state],
        borderRadius: '2em',
        color: 'white',
        display: 'inline-flex',
        fontSize: 14,
        fontWeight: 'bold',
        padding: '0.5em 0.7em',
      }}
    >
      {capitalizeFirstLetter(state)}
    </Box>
  );
};

export default AssignmentStatusChip;
