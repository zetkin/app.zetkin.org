import { FC, ReactNode } from 'react';
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
  color?: ZUIPrimary | ZUISecondary | 'error';

  /**
   * The icon.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  icon: MUIIcon;

  /**
   * The label
   */
  label: string | string[];

  /**
   * If true, the text will not overflow and end with an ellipsis.
   *
   * Defaults to "false".
   */
  noWrap?: boolean;

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
  noWrap = false,
  size = 'medium',
}) => {
  const labels: ReactNode[] = [];

  if (Array.isArray(label)) {
    label.forEach((text, index) => {
      if (index > 0) {
        labels.push(
          <Typography key={index} component="span" sx={{ mx: 1 }}>
            ·
          </Typography>
        );
      }

      labels.push(text);
    });
  } else {
    labels.push(label);
  }

  return (
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
        color={color}
        noWrap={noWrap}
        sx={{
          flexShrink: noWrap ? '' : 0,
        }}
        variant={TextVariants[size]}
      >
        {labels}
      </Typography>
    </Box>
  );
};

export default ZUIIconLabel;
