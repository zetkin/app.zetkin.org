import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';
import { StandardTextFieldProps, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const useStyles = makeStyles<Theme, ExpandingTextInputProps>((theme) => ({
  MuiInput: (props) => ({
    fontSize: theme.typography.h4.fontSize,
    padding: 0,
    width: `${props.inputWidth + 20}px`,
  }),
  MuiTextField: {
    display: 'inline',
    verticalAlign: 'inherit',
  },
}));

const useHiddenInputStyles = makeStyles<Theme>((theme) => ({
  hiddenInput: {
    fontSize: theme.typography.h4.fontSize,
    position: 'absolute',
    visibility: 'hidden',
  },
}));

interface ExpandingTextInputProps extends StandardTextFieldProps {
  inputWidth: number;
}

interface StyledTextInputProps extends StandardTextFieldProps {
  inputString?: string;
}

const ExpandingTextInput: React.FC<ExpandingTextInputProps> = (
  props
): JSX.Element => {
  const classes = useStyles(props);
  return (
    <TextField
      className={classes.MuiTextField}
      inputProps={{ className: classes.MuiInput }}
      {...props}
      variant="standard"
    />
  );
};

const StyledTextInput: React.FC<StyledTextInputProps> = (
  props
): JSX.Element => {
  const classes = useHiddenInputStyles(props);
  const hiddenInput = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(50);
  useEffect(() => {
    if (hiddenInput.current) {
      setInputWidth(hiddenInput.current?.offsetWidth || 50);
    }
  }, [props.inputString]);
  return (
    <>
      <span ref={hiddenInput} className={classes.hiddenInput}>
        {props.inputString}
      </span>
      <ExpandingTextInput inputWidth={inputWidth} {...props} />
    </>
  );
};

export default StyledTextInput;
