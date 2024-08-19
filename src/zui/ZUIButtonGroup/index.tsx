import { ButtonGroup } from '@mui/material';
import { FC } from 'react';

import ZUIButton, { ZUIButtonProps } from 'zui/ZUIButton';

interface ZUIButtonGroupProps {
  buttons: ZUIButtonProps[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'large' | 'medium' | 'small';
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const getVariant = (type: 'primary' | 'secondary' | 'tertiary') => {
  if (type === 'secondary') {
    return 'outlined';
  } else if (type === 'tertiary') {
    return 'text';
  } else {
    return 'contained';
  }
};

const ZUIButtonGroup: FC<ZUIButtonGroupProps> = ({
  buttons,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'primary',
}) => {
  return (
    <ButtonGroup
      orientation={orientation}
      size={size}
      variant={getVariant(variant)}
    >
      {buttons.map((button, index) => (
        <ZUIButton key={index} {...button} />
      ))}
    </ButtonGroup>
  );
};

export default ZUIButtonGroup;
