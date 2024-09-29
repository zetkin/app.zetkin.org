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
  /****
     *Example usecase:

    *   <ZUIToggleButton
          buttons={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ]}
          onChange={(event, newTimeScale) => {
            // Check if the newTimeScale is valid before calling the function
            if (newTimeScale) {
              onChangeTimeScale(newTimeScale as TimeScale); // Type assertion to TimeScale
            }
          }}
          orientation="horizontal"
          size="medium"
          value={timeScale}
        />
     *  
    ***/
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
