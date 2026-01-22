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
  /**
   * If the box is checked or not.
   */
  checked: boolean;

  /**
   * Controls if the checkbox is disabled or not.
   * Defaults to 'false'.
   */
  disabled?: boolean;

  /**
   * The label of the checkbox.
   */
  label: string;

  /**
   * The placement of the label. Defaults to 'end'.
   */
  labelPlacement?: ZUIPlacement;

  /**
   * The function that runs when the user clicks in the checkbox.
   */
  onChange: (newCheckedState: boolean) => void;

  /**
   * The size of the checkbox. Defaults to 'medium'.
   *
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
        '& .MuiTypography-root': {
          '-ms-user-select': 'none',
          '-webkit-user-select': 'none',
          marginTop: (theme) =>
            labelPlacement == 'start' || labelPlacement == 'end'
              ? `calc(${parseFloat(sizes[size]) / 2}rem + (9px - ${
                  theme.typography.labelXlMedium.lineHeight
                } / 2))`
              : 0,
          userSelect: 'none',
        },
        alignItems:
          labelPlacement == 'start' || labelPlacement == 'end'
            ? 'flex-start'
            : 'center',
        marginBottom:
          labelPlacement == 'top' || labelPlacement == 'bottom' ? '0.5rem' : '',
        marginLeft: labelPlacement != 'end' ? 0 : '',
        marginRight: labelPlacement != 'start' ? 0 : '',
        marginTop:
          labelPlacement == 'top' || labelPlacement == 'bottom' ? '0.5rem' : '',
      }}
    />
  );
};

export default ZUICheckbox;
