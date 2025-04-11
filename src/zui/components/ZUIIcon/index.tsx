import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap, useTheme } from '@mui/material';

import { ZUISize } from '../types';

type IconColor =
  | 'secondary'
  | 'primary'
  | 'data'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

type ZUIIconProps = {
  /**
   * Color of the icon.
   * Options: secondary, primary, data, success, info, warning and danger.
   *
   * Defaults to secondary.
   */
  color?: IconColor;

  /**
   * The MUI icon to be used.
   *
   * Pass in reference to the icon, for example: Close, not <Close/>.
   */
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;

  /**
   * Small, medium or large. Defaults to small.
   */
  size?: ZUISize;
};

const ZUIIcon: FC<ZUIIconProps> = ({
  color = 'secondary',
  icon: Icon,
  size = 'medium',
}) => {
  const theme = useTheme();
  const iconColors: Record<IconColor, string> = {
    danger: theme.palette.error.main,
    data: theme.palette.data.main,
    info: theme.palette.info.main,
    primary: theme.palette.text.primary,
    secondary: theme.palette.text.secondary,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
  };

  const fontSizes: Record<ZUISize, string> = {
    large: '2.188rem',
    medium: '1.5rem',
    small: '1.25rem',
  };

  return (
    <Icon
      sx={{
        color: iconColors[color],
        fontSize: fontSizes[size],
      }}
    />
  );
};

export default ZUIIcon;
