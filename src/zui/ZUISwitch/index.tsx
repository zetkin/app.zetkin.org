import { FormControlLabel, Switch, Typography } from '@mui/material';
import { FC } from 'react';

export interface ZUISwitchProps {
  checked: boolean;

  /**
   * Defaults to 'false'.
   */
  disabled?: boolean;

  label: string;

  /**
   * Placement of the label. Defaults to 'end'.
   */
  labelPlacement?: 'bottom' | 'end' | 'start' | 'top';

  onChange: (newCheckedState: boolean) => void;

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
  labelPlacement = 'end',
  onChange,
  size = 'medium',
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(event, newCheckedState) => onChange(newCheckedState)}
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
      labelPlacement={labelPlacement}
    />
  );
};

export default ZUISwitch;
