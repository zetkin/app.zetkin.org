import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useId } from 'react';

import { ZUIOrientation, ZUIPlacement, ZUISize } from '../types';

type Option = {
  disabled?: boolean;
  label: string;
  value: string;
};

const sizes: Record<ZUISize, string> = {
  large: '1.75rem',
  medium: '1.5rem',
  small: '1.25rem',
};

interface ZUIRadioButtonProps {
  orientation?: ZUIOrientation;

  /**
   * Set this to true if you want to disable the whole
   * radio group.
   *
   * If you want to disable a single radio, you do that in the options array.
   */
  disabled?: boolean;

  label: string;

  helperText?: string;

  labelPlacement?: ZUIPlacement;

  /**
   * Fires when a radio is selected.
   */
  onChange: (newValue: Option['value']) => void;

  /**
   * The options to select from.
   * Should be an array of objects with a label and a value,
   * and an optional boolean for if it is disabled (defaults to false).
   */
  options: Option[];

  /**
   * Small, medium or large. Only affects the size of the radios.
   */
  size?: ZUISize;

  /**
   * The selected radio option.
   * To have no radio selected as default, initiate to a falsy value.
   */
  value: Option['value'];
}

const ZUIRadioGroup = ({
  orientation = 'vertical',
  disabled,
  label,
  helperText,
  labelPlacement = 'end',
  onChange,
  options,
  size = 'medium',
  value,
}: ZUIRadioButtonProps) => {
  const labelId = useId();
  const helperTextId = useId();

  return (
    <FormControl disabled={disabled}>
      <FormLabel id={labelId}>
        <Typography
          sx={(theme) => ({
            color: disabled
              ? theme.palette.text.disabled
              : theme.palette.text.primary,
          })}
          variant="labelXlMedium"
        >
          {label}
        </Typography>
      </FormLabel>
      <RadioGroup
        aria-describedby={helperTextId}
        aria-labelledby={labelId}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        row={orientation === 'horizontal'}
        value={value}
      >
        {options.map((option) => {
          const isDisabled = disabled || option.disabled;
          return (
            <FormControlLabel
              key={option.value}
              control={<Radio />}
              disabled={isDisabled}
              label={
                <Typography
                  sx={(theme) => ({
                    color: isDisabled ? theme.palette.text.disabled : '',
                  })}
                  variant="labelXlMedium"
                >
                  {option.label}
                </Typography>
              }
              labelPlacement={labelPlacement}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: sizes[size],
                },
              }}
              value={option.value}
            />
          );
        })}
      </RadioGroup>
      {helperText && (
        <Typography
          id={helperTextId}
          sx={(theme) => ({
            color: disabled
              ? theme.palette.text.disabled
              : theme.palette.text.secondary,
          })}
          variant="labelSmMedium"
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

export default ZUIRadioGroup;
