import { Box } from '@mui/material';
import { Ref, useEffect, useRef } from 'react';

export enum ZUIPreviewableMode {
  EDITABLE = 'editable',
  PREVIEW = 'preview',
}

type ZUIPreviewableInputProps<ValueType, InputType> = {
  focusInitially?: boolean;
  mode: ZUIPreviewableMode;
  onSwitchMode?: (mode: ZUIPreviewableMode) => void;
  renderInput: (props: { ref: Ref<InputType> }) => JSX.Element;
  renderPreview?: () => JSX.Element;
  value: ValueType;
};

function ZUIPreviewableInput<
  ValueType extends string | number,
  InputType extends HTMLInputElement
>({
  focusInitially = false,
  mode,
  onSwitchMode,
  renderInput,
  renderPreview,
  value,
}: ZUIPreviewableInputProps<ValueType, InputType>): JSX.Element {
  const focusingRef = useRef(false);

  useEffect(() => {
    focusingRef.current = focusInitially;
  }, [focusInitially, mode]);

  if (mode == ZUIPreviewableMode.EDITABLE) {
    return (
      <Box>
        {renderInput({
          ref: (elem) => {
            if (focusingRef.current) {
              elem?.focus();
              focusingRef.current = false;
            }
          },
        })}
      </Box>
    );
  } else {
    return (
      <Box
        onClick={() => {
          focusingRef.current = true;
          if (onSwitchMode) {
            onSwitchMode(ZUIPreviewableMode.EDITABLE);
          }
        }}
      >
        {renderPreview ? renderPreview() : value}
      </Box>
    );
  }
}

export default ZUIPreviewableInput;
