import { TextField, TextFieldProps } from '@mui/material';

import oldTheme from 'theme';

const StyledNumberInput: React.FC<TextFieldProps> = (props): JSX.Element => {
  return (
    <TextField
      sx={{
        display: 'inline',
        verticalAlign: 'inherit',
      }}
      type="number"
      {...props}
      slotProps={{
        htmlInput: {
          ...props.inputProps,
          sx: {
            fontSize: oldTheme.typography.h4.fontSize,
            padding: 0,
            textAlign: 'center',
            width: '5rem',
          },
        },
      }}
      variant="standard"
    />
  );
};

export default StyledNumberInput;
