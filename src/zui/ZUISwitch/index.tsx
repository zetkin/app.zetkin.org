import { Switch } from '@mui/material';
import { FC } from 'react';

export interface ZUISwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'small' | 'medium';
}

const ZUISwitch: FC<ZUISwitchProps> = ({
  checked,
  onChange,
  size = 'medium',
}) => {
  return (
    <Switch
      checked={checked}
      inputProps={{ 'aria-label': 'controlled' }}
      onChange={(event, checked) => onChange(checked)}
      size={size}
    />
  );
};

export default ZUISwitch;
