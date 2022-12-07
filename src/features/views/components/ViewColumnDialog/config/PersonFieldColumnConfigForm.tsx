import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { MenuItem, TextField } from '@mui/material';

import {
  NATIVE_PERSON_FIELDS,
  PersonFieldViewColumn,
} from 'features/views/components/types';

interface PersonFieldColumnConfigFormProps {
  column: PersonFieldViewColumn;
  onChange: (column: PersonFieldViewColumn) => void;
}

const PersonFieldColumnConfigForm: FunctionComponent<
  PersonFieldColumnConfigFormProps
> = ({ column, onChange }) => {
  const intl = useIntl();

  const getTitle = (field: NATIVE_PERSON_FIELDS) => {
    if (field !== column.config.field) {
      // If field type changes, reset
      return intl.formatMessage({
        id: `misc.nativePersonFields.${field}`,
      });
    } else {
      return column.title;
    }
  };

  const onFieldChange = (field: NATIVE_PERSON_FIELDS) => {
    onChange({
      ...column,
      config: {
        field: field,
      },
      title: getTitle(field),
    });
  };

  return (
    <TextField
      fullWidth
      label={intl.formatMessage({
        id: 'misc.views.columnDialog.editor.fieldLabels.field',
      })}
      margin="normal"
      onChange={(ev) => onFieldChange(ev.target.value as NATIVE_PERSON_FIELDS)}
      required
      select
      value={column.config?.field}
      variant="standard"
    >
      {Object.values(NATIVE_PERSON_FIELDS).map((fieldSlug) => (
        <MenuItem key={fieldSlug} value={fieldSlug}>
          {intl.formatMessage({
            id: `misc.nativePersonFields.${fieldSlug}`,
          })}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default PersonFieldColumnConfigForm;
