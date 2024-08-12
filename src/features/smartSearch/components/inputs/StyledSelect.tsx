import { TextField, TextFieldProps, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
interface StyleProps {
  minWidth?: string;
}
const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  MuiInput: {
    fontSize: theme.typography.h4.fontSize,
    padding: 0,
  },
  MuiSelect: {
    fontSize: theme.typography.h4.fontSize,
    minWidth: ({ minWidth }) => minWidth,
    padding: 0,
  },
  MuiTextField: {
    display: 'inline',
    verticalAlign: 'inherit',
  },
}));

const StyledSelect: React.FC<TextFieldProps & { minWidth?: string }> = (
  props
): JSX.Element => {
  const classes = useStyles({ minWidth: props.minWidth });
  return (
    <TextField
      className={classes.MuiTextField}
      inputProps={{ className: classes.MuiInput }}
      select
      {...props}
      SelectProps={{ ...props.SelectProps, className: classes.MuiSelect }}
      variant="standard"
    />
  );
};

export default StyledSelect;
