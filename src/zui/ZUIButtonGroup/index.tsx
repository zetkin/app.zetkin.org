import { ButtonGroup } from '@mui/material';
import { FC, ReactNode } from 'react';

interface ZUIButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: 'large' | 'medium' | 'small';
  type?: 'primary' | 'secondary' | 'tertiary';
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
  children,
  orientation = 'horizontal',
  size = 'medium',
  type = 'primary',
}) => {
  return (
    <ButtonGroup
      orientation={orientation}
      size={size}
      variant={getVariant(type)}
    >
      {children}
    </ButtonGroup>
  );
};

export default ZUIButtonGroup;