import { FC } from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, IconButton } from '@mui/material';

import PersonFieldInput from 'zui/ZUICreatePerson/PersonFieldInput';

interface EditPersonFieldProps {
  error?: boolean;
  field: string;
  hasChanges: boolean;
  isURLField?: boolean;
  label?: string;
  onChange: (field: string, newValue: string) => void;
  onReset: () => void;
  required?: boolean;
  value: string;
}
const EditPersonField: FC<EditPersonFieldProps> = ({
  error,
  field,
  hasChanges,
  isURLField,
  label,
  onChange,
  onReset,
  required,
  value,
}) => {
  return (
    <Box display="flex" flex={1}>
      <PersonFieldInput
        error={error}
        field={field}
        isURLField={isURLField}
        label={label}
        onChange={(field, newValue) => onChange(field, newValue)}
        required={required}
        value={value}
      />
      {hasChanges && (
        <IconButton onClick={onReset}>
          <UndoIcon />
        </IconButton>
      )}
    </Box>
  );
};
export default EditPersonField;
