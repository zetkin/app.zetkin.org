import { TextField } from '@mui/material';
import { FC, MutableRefObject } from 'react';

import globalMessageIds from 'core/i18n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinJourneyNativeFields } from 'utils/types/zetkin';

interface JourneyFieldInputProps {
  disabled?: boolean;
  field: keyof ZetkinJourneyNativeFields;
  helperText?: string;
  label?: string;
  onChange?: (field: string, newValue: string) => void;
  required?: boolean;
  isURLField?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | undefined> | undefined;
  style?: Record<string, unknown>;
  error?: boolean;
  value?: string;
}
const JourneyFieldInput: FC<JourneyFieldInputProps> = ({
  disabled = false,
  field,
  helperText,
  label,
  onChange,
  required,
  style,
  inputRef,
  error,
  value,
}) => {
  const globalMessages = useMessages(globalMessageIds);

  return (
    <TextField
      disabled={disabled}
      error={error}
      fullWidth
      helperText={helperText}
      inputRef={inputRef}
      label={
        label ??
        globalMessages.journeyField[field as keyof ZetkinJourneyNativeFields]()
      }
      onBlur={(e) => onChange?.(field, e.target.value.trim())}
      onChange={(e) => onChange?.(field, e.target.value)}
      required={required}
      sx={style}
      value={value}
    />
  );
};
export default JourneyFieldInput;
