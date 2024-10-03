import { Switch } from '@mui/material';
import { FC } from 'react';

export interface ZUISwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  size?: 'small' | 'medium';
}

const ZUISwitch: FC<ZUISwitchProps> = ({
  checked,
  disabled = false,
  onChange,
  size = 'medium',
}) => {
  return (
    <Switch
      checked={checked}
      disabled={disabled}
      inputProps={{ 'aria-label': 'controlled' }}
      onChange={(event, checked) => onChange(checked)}
      size={size}
    />
  );
};

export default ZUISwitch;
