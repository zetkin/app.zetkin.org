import { FC, ReactNode } from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import globalMessageIds from 'core/i18n/messageIds';
import { useMessages } from 'core/i18n';
import {
  ZetkinCreatePerson,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

interface SelectOption {
  value: string;
  label: string | ReactNode;
}

interface PersonFieldSelectProps {
  disabled?: boolean;
  field: keyof ZetkinCreatePerson;
  label?: string;
  onChange: (field: string, newValue: string | null) => void;
  options: SelectOption[];
  value: string;
  onReset?: () => void;
  hasChanges?: boolean;
  editMode?: boolean;
}

const PersonFieldSelect: FC<PersonFieldSelectProps> = ({
  disabled = false,
  field,
  label,
  onChange,
  options,
  value,
  editMode = false,
  hasChanges,
  onReset,
}) => {
  const globalMessages = useMessages(globalMessageIds);

  const selectField = (
    <FormControl fullWidth>
      <InputLabel>
        {label
          ? label
          : globalMessages.personFields[
              field as keyof ZetkinPersonNativeFields
            ]()}
      </InputLabel>
      <Select
        disabled={disabled}
        label={
          label
            ? label
            : globalMessages.personFields[
                field as keyof ZetkinPersonNativeFields
              ]()
        }
        onChange={(e) => onChange(field, e.target.value)}
        value={value}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  if (editMode) {
    return selectField;
  }

  return (
    <Box display="flex">
      {selectField}
      {hasChanges && onReset && (
        <IconButton onClick={onReset}>
          <UndoIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default PersonFieldSelect;
