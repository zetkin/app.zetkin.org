import { TextField, TextFieldProps } from '@mui/material';

import oldTheme from 'theme';

const StyledNumberInput: React.FC<TextFieldProps> = (props): JSX.Element => {
  return (
    <TextField
      type="number"
      {...props}
      inputProps={{ ...props.inputProps, className: classes.MuiInput }}
      variant="standard"
    />
  );
};

export default StyledNumberInput;
