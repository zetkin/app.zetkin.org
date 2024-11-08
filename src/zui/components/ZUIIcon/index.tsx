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
  color?: IconColor;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
  size?: ZUISize;
};

const getFontSize = (size: ZUISize) => {
  if (size == 'small') {
    return '1rem';
  } else if (size == 'medium') {
    return '1.188rem';
  } else {
    //Size is "large"¨
    return '1.75rem';
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
