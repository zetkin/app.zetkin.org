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

const getFontSize = (size: ZUISize) => {
  if (size == 'small') {
    return '1rem';
  } else if (size == 'medium') {
    return '1.5rem';
  } else {
    //Size is "large"¨
    return '2.188rem';
  }
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
  return (
    <Icon
      sx={{
        color: iconColors[color],
        fontSize: getFontSize(size),
      }}
    />
  );
};

export default ZUIIcon;
