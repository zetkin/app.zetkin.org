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

  error?: boolean;

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
  error,
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
          sx={(theme) => {
            let color = theme.palette.text.primary;

            if (disabled) {
              color = theme.palette.text.disabled;
            }

            if (error) {
              color = theme.palette.error.main;
            }

            return {
              color,
            };
          }}
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
        sx={{
          '& > label.MuiFormControlLabel-labelPlacementBottom': {
            ' :first-child': {
              marginLeft: 0,
            },
            ' :last-child': {
              marginRight: 0,
            },
            marginBottom: '0.5rem',
            marginTop: '0.5rem',
          },
          '& > label.MuiFormControlLabel-labelPlacementEnd': {
            ' :last-child': {
              marginRight: 0,
            },
          },
          '& > label.MuiFormControlLabel-labelPlacementStart': {
            ' :first-child': {
              marginLeft: 0,
            },
            ' :not(:first-child)': {
              marginLeft: '2rem',
            },
          },
          '& > label.MuiFormControlLabel-labelPlacementTop': {
            ' :first-child': {
              marginLeft: 0,
            },
            ' :last-child': {
              marginRight: 0,
            },
            marginBottom: '0.5rem',
            marginTop: '0.5rem',
          },
        }}
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
          sx={(theme) => {
            let color = theme.palette.text.secondary;

            if (disabled) {
              color = theme.palette.text.disabled;
            }

            if (error) {
              color = theme.palette.error.main;
            }

            return {
              color,
            };
          }}
          variant="labelSmMedium"
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

export default ZUIRadioGroup;
