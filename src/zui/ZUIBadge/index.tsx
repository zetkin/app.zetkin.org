import { Box, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC } from 'react';

import { getContrastColor } from 'utils/colorUtils';

export interface ZUIBadgeProps {
  number?: number;
  status: ActivityStatus;
}

type ActivityStatus =
  | 'cancelled'
  | 'closed'
  | 'draft'
  | 'ended'
  | 'published'
  | 'scheduled';

const useStyles = makeStyles<Theme, { status: ActivityStatus }>((theme) => ({
  badge: {
    alignItems: 'center',
    backgroundColor: ({ status }) => theme.palette.activityStatusColors[status],
    borderRadius: '1.875rem',
    color: ({ status }) =>
      getContrastColor(theme.palette.activityStatusColors[status]),
    display: 'inline-flex',
    height: '1.875rem',
    justifyContent: 'center',
    width: '1.875rem',
  },
  dot: {
    alignItems: 'center',
    backgroundColor: ({ status }) => theme.palette.activityStatusColors[status],
    borderRadius: '1rem',
    height: '1rem',
    width: '1rem',
  },
}));

const ZUIBadge: FC<ZUIBadgeProps> = ({ number = undefined, status }) => {
  const classes = useStyles({ status });
  const style = number != undefined ? 'badge' : 'dot';
  let displayValue = '';

  if (number != undefined) {
    displayValue = number <= 99 ? number.toString() : '99+';
  }

  return (
    <Box className={classes[style]}>
      <Typography variant="labelSmMedium">{displayValue}</Typography>
    </Box>
  );
};

export default ZUIBadge;
