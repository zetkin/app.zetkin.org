import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { MUIIcon, ZUIPrimary, ZUISecondary, ZUISize } from '../types';
import ZUIIcon from '../ZUIIcon';

const TextVariants = {
  large: 'bodyMdRegular',
  medium: 'bodySmRegular',
  small: 'bodySmRegular',
} as const;

export type ZUIIconLabelProps = {
  /**
   * The color of the icon-label pair.
   *
   * Defaults to "primary".
   */
  color?: ZUIPrimary | ZUISecondary | 'danger';

  /**
   * The icon.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  icon: MUIIcon;

  /**
   * The label
   */
  label: string | JSX.Element;

  /**
   * The size of the icon-label pair.
   *
   * Defaults to "medium."
   */
  size?: ZUISize;
};

const ZUIIconLabel: FC<ZUIIconLabelProps> = ({
  color = 'primary',
  icon,
  label,
  size = 'medium',
}) => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexShrink: 0,
      gap: '0.5rem',
    }}
  >
    <ZUIIcon color={color} icon={icon} size={size} />
    <Typography
      color={color == 'danger' ? 'error' : color}
      sx={{
        flexShrink: 0,
      }}
      variant={TextVariants[size]}
    >
      {label}
    </Typography>
  </Box>
);

export default ZUIIconLabel;
