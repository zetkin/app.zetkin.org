import { TextField, TextFieldProps } from '@mui/material';
import { merge } from 'lodash';

import oldTheme from 'theme';

const StyledNumberInput: React.FC<TextFieldProps> = (props): JSX.Element => {
  const slotProps = merge<typeof props.slotProps, typeof props.slotProps>(
    {
      htmlInput: {
        sx: {
          fontSize: oldTheme.typography.h4.fontSize,
          padding: 0,
          textAlign: 'center',
          width: '5rem',
        },
      },
    },
    props.slotProps
  );
  return (
    <TextField
      sx={{
        display: 'inline',
        verticalAlign: 'inherit',
      }}
      type="number"
      {...props}
      slotProps={slotProps}
      variant="standard"
    />
  );
};

export default StyledNumberInput;
