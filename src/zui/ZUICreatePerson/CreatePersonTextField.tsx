import { FC, MutableRefObject } from 'react';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { TextField } from '@mui/material';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinCreatePerson,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';
import messageIds from 'zui/l10n/messageIds';

interface CreatePersonTextFieldProps {
  field: keyof ZetkinCreatePerson;
  label?: string;
  onChange: (field: string, value: string) => void;
  required?: boolean;
  isURLField?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | undefined> | undefined;
  style?: {};
  onBlur?: (field: string) => void;
  error?: boolean;
}
const CreatePersonTextField: FC<CreatePersonTextFieldProps> = ({
  field,
  label,
  onChange,
  required,
  style,
  inputRef,
  isURLField,
  error,
}) => {
  const globalMessages = useMessages(globalMessageIds);

  return (
    <TextField
      error={error}
      helperText={
        error && (
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
      fullWidth
      label={
        label
          ? label
          : globalMessages.personFields[
              field as keyof ZetkinPersonNativeFields
            ]()
      }
      onChange={(e) => onChange(field, e.target.value)}
      required={required}
      sx={style}
      inputRef={inputRef}
    />
  );
};
export default CreatePersonTextField;
