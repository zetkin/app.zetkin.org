import { Box } from '@mui/material';
import { HTMLProps, useRef } from 'react';

export enum ZUIPreviewableMode {
  EDITABLE = 'editable',
  PREVIEW = 'preview',
}

type ZUIPreviewableInputProps<ValueType, InputType> = {
  mode: ZUIPreviewableMode;
  onSwitchMode?: (mode: ZUIPreviewableMode) => void;
  renderInput: (props: HTMLProps<InputType>) => JSX.Element;
  renderPreview?: () => JSX.Element;
  value: ValueType;
};

function ZUIPreviewableInput<
  ValueType extends string | number,
  InputType extends HTMLElement
>({
  mode,
  onSwitchMode,
  renderInput,
  renderPreview,
  value,
}: ZUIPreviewableInputProps<ValueType, InputType>): JSX.Element {
  const focusingRef = useRef(false);

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
