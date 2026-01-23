import { TextField, TextFieldProps } from '@mui/material';

import oldTheme from 'theme';

const StyledSelect: React.FC<TextFieldProps & { minWidth?: string }> = (
  props
): JSX.Element => {
  return (
    <TextField
      select
      sx={{
        display: 'inline',
        verticalAlign: 'inherit',
      }}
      {...props}
      slotProps={{
        htmlInput: {
          sx: {
            fontSize: oldTheme.typography.h4.fontSize,
            padding: 0,
          },
        },
        select: {
          ...props.SelectProps,
          sx: {
            fontSize: oldTheme.typography.h4.fontSize,
            minWidth: props.minWidth,
            padding: 0,
          },
        },
      }}
      variant="standard"
    />
  );
};

export default StyledSelect;
