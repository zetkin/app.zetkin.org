import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

import { ZUISize } from '../types';

type ZUIIconProps = {
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

const ZUIIcon: FC<ZUIIconProps> = ({ icon: Icon, size = 'medium' }) => {
  return (
    <Icon
      sx={(theme) => ({
        color: theme.palette.grey[400],
        fontSize: getFontSize(size),
      })}
    />
  );
};

export default ZUIIcon;
