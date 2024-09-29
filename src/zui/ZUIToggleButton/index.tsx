import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface Buttons {
  value: string;
  label: string;
}

interface ZUIToggleButtonProps {
  buttons: Buttons[];
  onChange: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;
  value: string;
  orientation?: 'vertical' | 'horizontal';
  size?: 'small' | 'medium' | 'large';
}

const ZUIToggleButton: React.FC<ZUIToggleButtonProps> = ({
  buttons,
  onChange,
  value,
  orientation = 'horizontal',
  size = 'medium',
}) => {
  return (
    <ToggleButtonGroup
      exclusive
      onChange={onChange}
      orientation={orientation}
      size={size}
      value={value}
    >
      {buttons.map((buttons) => (
        <ToggleButton
          key={buttons.value}
          onClick={(event) => {
            onChange(event, buttons.value);
          }}
          value={buttons.value}
        >
          {buttons.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ZUIToggleButton;
