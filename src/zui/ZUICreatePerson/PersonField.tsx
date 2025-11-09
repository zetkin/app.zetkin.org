import { FC, MutableRefObject, ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';

import PersonFieldInput from './PersonFieldInput';
import PersonFieldSelect from './PersonFieldSelect';
import { ZetkinCreatePerson } from 'utils/types/zetkin';

interface SelectOption {
  value: string;
  label: string | ReactNode;
}

interface BasePersonFieldProps {
  disabled?: boolean;
  editMode?: boolean;
  error?: boolean;
  field: keyof ZetkinCreatePerson;
  hasChanges?: boolean;
  label?: string;
  onChange: (field: string, newValue: string | null) => void;
  onReset?: () => void;
  value: string;
}

interface TextPersonFieldProps extends BasePersonFieldProps {
  fieldType: 'text';
  isURLField?: boolean;
  required?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | undefined>;
  style?: Record<string, unknown>;
}

interface SelectPersonFieldProps extends BasePersonFieldProps {
  fieldType: 'select';
  options: SelectOption[];
}

type PersonFieldProps = TextPersonFieldProps | SelectPersonFieldProps;

const PersonField: FC<PersonFieldProps> = (props) => {
  const {
    fieldType,
    editMode = false,
    hasChanges,
    onReset,
    ...commonProps
  } = props;

  const renderField = () => {
    if (fieldType === 'select') {
      const { options } = props as SelectPersonFieldProps;
      return <PersonFieldSelect {...commonProps} editMode options={options} />;
    } else {
      const { isURLField, required, inputRef, style } =
        props as TextPersonFieldProps;
      return (
        <PersonFieldInput
          {...commonProps}
          editMode
          inputRef={inputRef}
          isURLField={isURLField}
          required={required}
          style={style}
        />
      );
    }
  };

  const showUndoButton = !editMode && hasChanges && onReset;

  return (
    <Box alignItems="flex-start" display="flex" flex={1}>
      {renderField()}
      {showUndoButton && (
        <IconButton onClick={onReset} sx={{ paddingTop: 2 }}>
          <UndoIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default PersonField;
