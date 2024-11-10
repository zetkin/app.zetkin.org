import { FormControlLabel, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { FC } from 'react';

import { ZUIPlacement, ZUISize } from '../types';

const sizes: Record<ZUISize, string> = {
  large: '1.75rem',
  medium: '1.5rem',
  small: '1.25rem',
};

export type ZUICheckboxProps = {
  checked: boolean;

  /**
   * Controls if the checkbox is disabled or not.
   * Defaults to 'false'.
   */
  disabled?: boolean;

  label: string;

  /**
   * The placement of the label. Defaults to 'end'.
   */
  labelPlacement?: ZUIPlacement;

  onChange: (newCheckedState: boolean) => void;

  /**
   * The size of the checkbox. Defaults to 'medium'.
   * This does not affect the size of the label text.
   */
  size?: ZUISize;
};

const ZUICheckbox: FC<ZUICheckboxProps> = ({
  checked,
  disabled = false,
  onChange,
  label,
  labelPlacement = 'end',
  size = 'medium',
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(ev, newCheckedState) => onChange(newCheckedState)}
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
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: sizes[size],
        },
      }}
    />
  );
};

export default ZUICheckbox;
