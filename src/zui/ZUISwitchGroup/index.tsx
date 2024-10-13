import { FormControl, FormGroup, FormLabel, Typography } from '@mui/material';
import { FC, useId } from 'react';

import ZUISwitch, { ZUISwitchProps } from 'zui/ZUISwitch';

type ZUISwitchGroupProps = {
  /**
   * This controls if the whole group is disabled.
   *
   * If you want to disable a single switch, do that in the options array.
   */
  disabled?: boolean;

  error?: boolean;

  helperText?: string;

  label: string;

  /**
   * A list of props for switches.
   */
  options: ZUISwitchProps[];
};

const ZUISwitchGroup: FC<ZUISwitchGroupProps> = ({
  disabled,
  error,
  helperText,
  label,
  options,
}) => {
  const labelId = useId();
  const helperTextId = useId();

  return (
    <FormControl component="fieldset" disabled={disabled} variant="standard">
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
      <FormGroup aria-describedby={helperTextId} aria-labelledby={labelId}>
        {options.map((option) => (
          <ZUISwitch key={option.label} {...option} disabled={disabled} />
        ))}
      </FormGroup>
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

export default ZUISwitchGroup;
