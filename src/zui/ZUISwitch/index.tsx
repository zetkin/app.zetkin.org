import { FormControlLabel, Switch, Typography } from '@mui/material';
import { FC } from 'react';

export interface ZUISwitchProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;

  /**
   * The size of the switch.
   *
   * This does not affect the label size.
   */
  size?: 'small' | 'medium';
}

const ZUISwitch: FC<ZUISwitchProps> = ({
  checked,
  disabled = false,
  label,
  onChange,
  size = 'medium',
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(event, checked) => onChange(checked)}
          size={size}
        />
      }
      disabled={disabled}
      label={
        <Typography
          sx={(theme) => ({
            color: disabled ? theme.palette.text.disabled : '',
          })}
          variant="labelXlMedium"
        >
          {label}
        </Typography>
      }
    />
  );
};

export default ZUISwitch;
