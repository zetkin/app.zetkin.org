import { makeStyles, TextField, TextFieldProps } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  MuiInput: {
    fontSize: theme.typography.h4.fontSize,
    padding: 0,
  },
  MuiSelect: {
    fontSize: theme.typography.h4.fontSize,
    padding: 0,
  },
  MuiTextField: {
    display: 'inline',
    verticalAlign: 'inherit',
  },
}));

const StyledSelect: React.FC<TextFieldProps> = (props): JSX.Element => {
  const classes = useStyles();
  return (
    <TextField
      className={classes.MuiTextField}
      inputProps={{ className: classes.MuiInput }}
      select
      {...props}
      SelectProps={{ ...props.SelectProps, className: classes.MuiSelect }}
    />
  );
};

export default StyledSelect;
