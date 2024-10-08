import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FC } from 'react';

interface Option {
  value: string;
  label: string;
}

interface ZUIToggleButtonProps {
  options: Option[];
  onChange: (value: string) => void;
  value: string;
  orientation?: 'vertical' | 'horizontal';
  size?: 'small' | 'medium' | 'large';
}

const ZUIToggleButton: FC<ZUIToggleButtonProps> = ({
  options,
  onChange,
  value,
  orientation = 'horizontal',
  size = 'medium',
}) => {
  return (
    <ToggleButtonGroup
      exclusive
      onChange={(ev, newValue) => onChange(newValue)}
      orientation={orientation}
      size={size}
      value={value}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ZUIToggleButton;
