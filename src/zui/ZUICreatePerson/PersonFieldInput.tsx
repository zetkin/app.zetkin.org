import { TextField } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton } from '@mui/material';
import { Box } from '@mui/material';
import { FC, MutableRefObject } from 'react';

import FieldValidationWarning from './FieldValidationWarning';
import globalMessageIds from 'core/i18n/messageIds';
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
  onReset?: () => void;
  hasChanges?: boolean;
  editMode?: boolean;
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
  // only relevant for edit mode
  editMode = false,
  hasChanges,
  onReset,
}) => {
  const globalMessages = useMessages(globalMessageIds);

  const textField = (
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

  return editMode ? (
    textField
  ) : (
    <Box alignItems="flex-start" display="flex" flex={1}>
      {textField}
      {hasChanges && (
        <IconButton onClick={onReset} sx={{ paddingTop: 2 }}>
          <UndoIcon />
        </IconButton>
      )}
    </Box>
  );
};
export default PersonFieldInput;
