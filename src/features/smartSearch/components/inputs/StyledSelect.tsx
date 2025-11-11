import { TextField, TextFieldProps, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import oldTheme from 'theme';

interface StyleProps {
  minWidth?: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  MuiInput: {},
  MuiSelect: {
    fontSize: oldTheme.typography.h4.fontSize,
    minWidth: ({ minWidth }) => minWidth,
    padding: 0,
  },
  MuiTextField: {},
}));

const StyledSelect: React.FC<TextFieldProps & { minWidth?: string }> = (
  props
): JSX.Element => {
  const classes = useStyles({ minWidth: props.minWidth });
  return (
    <TextField
      className={classes.MuiTextField}
      select
      slotProps={{
        input: {
          ...props.slotProps?.input,
          sx: {
            fontSize: oldTheme.typography.h4.fontSize,
            input: {
              padding: 0,
            },
          },
        },
        select: {
          ...props.slotProps?.select,
          sx: {
            '.MuiSelect-standard': {
              padding: 0,
            },
            fontSize: oldTheme.typography.h4.fontSize,
            minWidth: props.minWidth,
          },
        },
      }}
      sx={{
        display: 'inline',
        verticalAlign: 'inherit',
      }}
      {...props}
      variant="standard"
    />
  );
};

export default StyledSelect;
