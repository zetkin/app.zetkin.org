import { Switch } from '@mui/material';
import { ChangeEvent, FC, ReactElement } from 'react';

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
      onChange={(event, checked) => onChange(checked)}
      inputProps={{ 'aria-label': 'controlled' }}
      size={size}
    />
  );
};

export default ZUISwitch;
