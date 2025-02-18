import { Badge, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FC, ReactNode } from 'react';

import { getContrastColor } from 'utils/colorUtils';

export interface ZUIBadgeProps {
  /**
   * Number to be displayed inside the badge
   */
  number?: number;

  /** If true, a number over 99 will be displayed in the badge as '99+'.
   * Defaults to false.
   */
  truncateLargeNumber?: boolean;

  /**
   * Color of the badge
   */
  color: 'primary' | 'success' | 'info' | 'data' | 'warning' | 'danger';

  /**
   * The component that the ZUIBadge will display on top of.
   * */
  children: ReactNode;
}

const useStyles = makeStyles<
  Theme,
  {
    color: 'primary' | 'success' | 'info' | 'data' | 'warning' | 'error';
    hasNumber: boolean;
  }
>((theme) => ({
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: ({ color }) => theme.palette[color].main,
      border: `2px solid ${theme.palette.common.white}`,
      borderRadius: ({ hasNumber }) => (!hasNumber ? '2rem' : ''),
      color: ({ color }) => getContrastColor(theme.palette[color].main),
      height: ({ hasNumber }) => (!hasNumber ? '0.625rem' : ''),
      padding: ({ hasNumber }) =>
        hasNumber ? '0.188rem 0.438rem 0.188rem 0.438rem' : '',
      width: ({ hasNumber }) => (!hasNumber ? '0.625rem' : ''),
    },
  },
}));

const ZUIBadge: FC<ZUIBadgeProps> = ({
  number,
  children,
  color,
  truncateLargeNumber = false,
}) => {
  const classes = useStyles({
    color: color == 'danger' ? 'error' : color,
    hasNumber: typeof number == 'number',
  });

  return (
    <Badge
      badgeContent={number}
      className={classes.badge}
      max={truncateLargeNumber ? 99 : 999999}
      variant={typeof number == 'number' ? 'standard' : 'dot'}
    >
      {children}
    </Badge>
  );
};

export default ZUIBadge;
