import { Box } from '@mui/material';
import { StandardTextFieldProps, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import oldTheme from 'theme';

interface ExpandingTextInputProps extends StandardTextFieldProps {
  inputWidth: number;
}

interface StyledTextInputProps extends StandardTextFieldProps {
  inputString?: string;
}

const ExpandingTextInput: React.FC<ExpandingTextInputProps> = (
  props
): JSX.Element => {
  return (
    <TextField
      {...props}
      sx={{
        display: 'inline',
        input: {
          fontSize: oldTheme.typography.h4.fontSize,
          padding: 0,
          width: `${props.inputWidth + 20}px`,
        },
        verticalAlign: 'inherit',
      }}
      variant="standard"
    />
  );
};

const StyledTextInput: React.FC<StyledTextInputProps> = (
  props
): JSX.Element => {
  const hiddenInput = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(50);
  useEffect(() => {
    if (hiddenInput.current) {
      setInputWidth(hiddenInput.current?.offsetWidth || 50);
    }
  }, [props.inputString]);
  return (
    <>
      <Box
        ref={hiddenInput}
        component="span"
        sx={{
          fontSize: oldTheme.typography.h4.fontSize,
          position: 'absolute',
          visibility: 'hidden',
        }}
      >
        {props.inputString}
      </Box>
      <ExpandingTextInput inputWidth={inputWidth} {...props} />
    </>
  );
};

export default StyledTextInput;
