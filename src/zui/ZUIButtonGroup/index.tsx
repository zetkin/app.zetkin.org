import { ButtonGroup } from '@mui/material';
import { FC } from 'react';

import ZUIButton, { getVariant, ZUIButtonProps } from 'zui/ZUIButton';
import ZUIIconButton, { ZUIIconButtonProps } from 'zui/ZUIIconButton';

interface ZUIButtonGroupProps {
  buttons: (ZUIButtonProps | ZUIIconButtonProps)[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'large' | 'medium' | 'small';
  variant?: 'primary' | 'secondary' | 'tertiary';
}

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
      {buttons.map((button) => {
        if ('icon' in button) {
          return <ZUIIconButton {...button} />;
        } else {
          return <ZUIButton {...button} />;
        }
      })}
    </ButtonGroup>
  );
};

export default ZUIButtonGroup;
