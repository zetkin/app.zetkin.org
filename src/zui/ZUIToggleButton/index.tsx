import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FC } from 'react';

type TextOption = {
  label: string;
  value: string;
};

type IconOption = {
  label: JSX.Element;
  value: string;
};

interface ZUIToggleButtonProps {
  /**
   * One option for each button.
   * The labels can be either strings or elements, for icon buttons.
   */
  options: TextOption[] | IconOption[];

  onChange: (newValue: string) => void;

  value: string;

  /**
   * The orientation of the row of buttons.
   * Defaults to 'horizontal'.
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * The size of the buttons.
   * Defaults to 'medium'.
   */
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
