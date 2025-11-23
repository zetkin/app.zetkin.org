import { FC } from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, IconButton, Checkbox } from '@mui/material';

interface EditPersonFieldProps {
  disabled?: boolean;
  field: string;
  hasChanges: boolean;
  markedFields: string[];
  onChange: (field: string, newValue: string) => void;
  onReset: () => void;
  value: string;
}
const EditPersonField: FC<EditPersonFieldProps> = ({
  disabled = false,
  field,
  hasChanges,
  markedFields,
  onChange,
  onReset,
  value,
}) => {
  return (
    <Box alignItems="flex-start" display="flex" flex={1}>
      <Checkbox
      checked={markedFields.includes(field)}
      disabled={disabled}
      onChange={
        (event) => onChange(field, event.target.checked ? 'faulty' : "")
      }
      />
      {/* <PersonFieldInput
        disabled={disabled}
        error={error}
        field={field}
        isURLField={isURLField}
        label={label}
        onChange={(field, newValue) => onChange(field, newValue)}
        required={required}
        value={value}
      /> */}
      {field}: {value}
      {hasChanges && (
        <IconButton onClick={onReset} sx={{ paddingTop: 2 }}>
          <UndoIcon />
        </IconButton>
      )}
    </Box>
  );
};
export default EditPersonField;
