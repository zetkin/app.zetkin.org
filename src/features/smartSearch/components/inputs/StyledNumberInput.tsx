import { TextField, TextFieldProps } from '@mui/material';

import oldTheme from 'theme';

const StyledNumberInput: React.FC<TextFieldProps> = (props): JSX.Element => {
  return (
    <TextField
      type="number"
      {...props}
      slotProps={{ htmlInput: { ...props.slotProps?.htmlInput } }}
      sx={{
        display: 'inline',
        input: {
          fontSize: oldTheme.typography.h4.fontSize,
          padding: 0,
          textAlign: 'center',
          width: '5rem',
        },
        verticalAlign: 'inherit',
      }}
      variant="standard"
    />
  );
};

export default StyledNumberInput;
