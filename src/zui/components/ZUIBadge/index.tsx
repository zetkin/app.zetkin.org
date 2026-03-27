import { Badge } from '@mui/material';
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

const ZUIBadge: FC<ZUIBadgeProps> = ({
  number,
  children,
  color,
  truncateLargeNumber = false,
}) => {
  const colorName = color === 'danger' ? 'error' : color;
  const hasNumber = typeof number === 'number';

  return (
    <Badge
      badgeContent={number}
      max={truncateLargeNumber ? 99 : 999999}
      sx={(theme) => ({
        '& .MuiBadge-badge': {
          backgroundColor: theme.palette[colorName].main,
          border: `2px solid ${theme.palette.common.white}`,
          borderRadius: !hasNumber ? '2rem' : undefined,
          color: getContrastColor(theme.palette[colorName].main),
          height: !hasNumber ? '0.625rem' : undefined,
          padding: hasNumber
            ? '0.188rem 0.438rem 0.188rem 0.438rem'
            : undefined,
          width: !hasNumber ? '0.625rem' : undefined,
        },
      })}
      variant={typeof number === 'number' ? 'standard' : 'dot'}
    >
      {children}
    </Badge>
  );
};

export default ZUIBadge;
