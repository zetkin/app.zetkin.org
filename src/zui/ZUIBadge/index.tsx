import { Box, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC } from 'react';

import { getContrastColor } from 'utils/colorUtils';
import { ActivityStatus } from 'zui/types';

export interface ZUIBadgeProps {
  /** Number to be displayed inside the badge */
  number?: number;

  /** If true, a number over 99 will be displayed in the badge as '99+'.
   * Defaults to false.
   */
  truncateLargeNumber?: boolean;

  /** Activity status to determine the color of the badge. */
  status: ActivityStatus;
}

const useStyles = makeStyles<
  Theme,
  { number: number | undefined; status: ActivityStatus }
>((theme) => ({
  badge: {
    alignItems: 'center',
    backgroundColor: ({ status }) => theme.palette.activityStatusColors[status],
    borderRadius: '1.875rem',
    color: ({ status }) =>
      getContrastColor(theme.palette.activityStatusColors[status]),
    display: 'inline-flex',
    height: '1.375rem',
    justifyContent: 'center',
    minWidth: '1.375rem',
    paddingLeft: ({ number }) =>
      number && (number > 99 || number < 0) ? '0.375rem' : '',
    paddingRight: ({ number }) =>
      number && (number > 99 || number < 0) ? '0.375rem' : '',
  },
  dot: {
    alignItems: 'center',
    backgroundColor: ({ status }) => theme.palette.activityStatusColors[status],
    borderRadius: '1rem',
    height: '1rem',
    width: '1rem',
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: '0.9rem',
  },
}));

const ZUIBadge: FC<ZUIBadgeProps> = ({
  number,
  status,
  truncateLargeNumber = false,
}) => {
  const classes = useStyles({ number, status });

  const showValue = number != undefined;
  const style = showValue ? 'badge' : 'dot';

  return (
    <Box className={classes[style]}>
      <Typography className={classes.text}>
        {showValue && !truncateLargeNumber && number.toString()}
        {showValue && truncateLargeNumber && number > 99 && '99+'}
      </Typography>
    </Box>
  );
};

export default ZUIBadge;
