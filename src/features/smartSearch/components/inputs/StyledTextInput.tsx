import { styled } from '@mui/material';
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
      slotProps={{
        htmlInput: {
          sx: {
            fontSize: oldTheme.typography.h4.fontSize,
            padding: 0,
            width: `${props.inputWidth + 20}px`,
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

const InputString = styled('span')({
  fontSize: oldTheme.typography.h4.fontSize,
  position: 'absolute',
  visibility: 'hidden',
});

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
      <InputString ref={hiddenInput}>{props.inputString}</InputString>
      <ExpandingTextInput inputWidth={inputWidth} {...props} />
    </>
  );
};

export default StyledTextInput;
