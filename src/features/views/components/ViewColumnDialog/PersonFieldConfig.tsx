import { useState } from 'react';
import {
  Box,
  Chip,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  PersonFieldViewColumn,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../types';

interface PersonFieldConfigProps {
  existingColumns: ZetkinViewColumn[];
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const PersonFieldConfig = ({
  existingColumns,
  onOutputConfigured,
}: PersonFieldConfigProps) => {
  const intl = useIntl();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const personFieldsInView = existingColumns.filter(
    (column) => column.type === COLUMN_TYPE.PERSON_FIELD
  ) as PersonFieldViewColumn[];

  const makeColumns = (fields: string[]) => {
    return fields.map((field) => ({
      config: { field: field },
      title: intl.formatMessage({
        id: `misc.nativePersonFields.${field}`,
      }),
      type: COLUMN_TYPE.PERSON_FIELD,
    }));
  };

  return (
    <FormControl sx={{ width: 300 }}>
      <InputLabel>
        {intl.formatMessage({
          id: 'misc.views.columnDialog.editor.fieldLabels.field',
        })}
      </InputLabel>
      <Select
        input={<Input />}
        MenuProps={{
          PaperProps: {
            style: {
              border: '2px',
              width: 250,
            },
          },
        }}
        multiple
        onChange={(evt) => {
          setSelectedFields(evt.target.value as string[]);
          const columns = makeColumns(evt.target.value as string[]);
          onOutputConfigured(columns);
        }}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((fieldSlug) => (
              <Chip
                key={fieldSlug}
                label={intl.formatMessage({
                  id: `misc.nativePersonFields.${fieldSlug}`,
                })}
              />
            ))}
          </Box>
        )}
        value={selectedFields}
      >
        {Object.values(NATIVE_PERSON_FIELDS).map((fieldSlug) => {
          const disabled = !!personFieldsInView.find(
            (field) => field.config.field === fieldSlug
          );
          return (
            <MenuItem
              key={fieldSlug}
              disabled={disabled}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
              value={fieldSlug}
            >
              {intl.formatMessage({
                id: `misc.nativePersonFields.${fieldSlug}`,
              })}
              {disabled && (
                <Typography sx={{ fontStyle: 'italic' }} variant="body2">
                  <Msg id="misc.views.columnDialog.editor.alreadyInView" />
                </Typography>
              )}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default PersonFieldConfig;
