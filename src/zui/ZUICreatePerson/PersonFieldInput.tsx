import { TextField } from '@mui/material';
import { FC, MutableRefObject } from 'react';

import FieldValidationWarning from './FieldValidationWarning';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { useMessages } from 'core/i18n';
import {
  ZetkinCreatePerson,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

interface PersonFieldInputProps {
  disabled?: boolean;
  field: keyof ZetkinCreatePerson;
  label?: string;
  onChange: (field: string, newValue: string) => void;
  required?: boolean;
  isURLField?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | undefined> | undefined;
  style?: Record<string, unknown>;
  error?: boolean;
  value?: string;
}
const PersonFieldInput: FC<PersonFieldInputProps> = ({
  disabled = false,
  field,
  label,
  onChange,
  required,
  style,
  inputRef,
  isURLField,
  error,
  value,
}) => {
  const globalMessages = useMessages(globalMessageIds);

  return (
    <TextField
      disabled={disabled}
      error={error}
      fullWidth
      helperText={
        error && (
          <FieldValidationWarning field={field} isURLField={isURLField} />
        )
      }
      inputRef={inputRef}
      label={
        label
          ? label
          : globalMessages.personFields[
              field as keyof ZetkinPersonNativeFields
            ]()
      }
      onBlur={(e) => onChange(field, e.target.value.trim())}
      onChange={(e) => onChange(field, e.target.value)}
      required={required}
      sx={style}
      value={value}
    />
  );
};
export default PersonFieldInput;
