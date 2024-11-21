import { Box } from '@mui/material';
import { FC } from 'react';

import { ActivityStatus } from 'zui/types';

type ZUIActivityStatusBadgeProps = {
  /**
   * Activity status to determine the color of the badge.
   */
  status: ActivityStatus;
};

const ZUIActivityStatusBadge: FC<ZUIActivityStatusBadgeProps> = ({
  status,
}) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.activityStatusColors[status],
        borderRadius: '1rem',
        height: '0.625rem',
        width: '0.625rem',
      })}
    />
  );
};

export default ZUIActivityStatusBadge;
