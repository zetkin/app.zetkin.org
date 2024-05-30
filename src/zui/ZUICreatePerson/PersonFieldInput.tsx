import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'zui/l10n/messageIds';
import { TextField } from '@mui/material';
import { FC, MutableRefObject, useState } from 'react';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinCreatePerson,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

interface PersonFieldInputProps {
  field: keyof ZetkinCreatePerson;
  label?: string;
  initialValue?: string;
  onChange: (field: string, value: string) => void;
  required?: boolean;
  isURLField?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | undefined> | undefined;
  style?: Record<string, unknown>;
  error?: boolean;
}
const PersonFieldInput: FC<PersonFieldInputProps> = ({
  field,
  label,
  initialValue,
  onChange,
  required,
  style,
  inputRef,
  isURLField,
  error,
}) => {
  const globalMessages = useMessages(globalMessageIds);
  const [blurred, setBlurred] = useState(false);
  const [value, setValue] = useState(initialValue ?? '');

  return (
    <TextField
      error={error}
      fullWidth
      helperText={
        error &&
        blurred && (
          <Msg
            id={
              isURLField
                ? messageIds.createPerson.validationWarning.url
                : field === 'alt_phone' || field === 'phone'
                ? messageIds.createPerson.validationWarning.phone
                : messageIds.createPerson.validationWarning.email
            }
          />
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
      onBlur={() => setBlurred(true)}
      onChange={(e) => {
        const trimmedValue = e.target.value.trim();
        setValue(trimmedValue);
        onChange(field, trimmedValue);
      }}
      onFocus={() => setBlurred(false)}
      required={required}
      sx={style}
      value={value}
    />
  );
};
export default PersonFieldInput;
