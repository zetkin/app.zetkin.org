import { FormControl, FormGroup, FormLabel, Typography } from '@mui/material';
import { FC, useId } from 'react';

import ZUICheckbox, { ZUICheckboxProps } from 'zui/newDesignSystem/ZUICheckbox';

type ZUICheckboxGroupProps = {
  /**
   * This controls if the whole group is disabled.
   *
   * If you want to disable a single checkbox, do that in the options array.
   */
  disabled?: boolean;

  error?: boolean;

  helperText?: string;

  label: string;

  /**
   * A list of props for checkboxes.
   */
  options: ZUICheckboxProps[];
};

/**
 * This component is used to group ZUICheckbox and ZUISwitch controls.
 */
const ZUICheckboxGroup: FC<ZUICheckboxGroupProps> = ({
  options,
  disabled = false,
  error = false,
  helperText,
  label,
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
          <ZUICheckbox key={option.label} {...option} disabled={disabled} />
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

export default ZUICheckboxGroup;
