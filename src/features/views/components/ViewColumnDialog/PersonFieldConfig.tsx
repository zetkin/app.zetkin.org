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

import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  PersonFieldViewColumn,
  SelectedViewColumn,
  ZetkinViewColumn,
} from '../types';
import { Msg, useMessages } from 'core/i18n';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'features/views/l10n/messageIds';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';

interface PersonFieldConfigProps {
  existingColumns: ZetkinViewColumn[];
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

interface Field {
  slug: string;
  title: string;
}

const PersonFieldConfig = ({
  existingColumns,
  onOutputConfigured,
}: PersonFieldConfigProps) => {
  const messages = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { orgId } = useNumericRouteParams();
  const customFields = useCustomFields(orgId).data ?? [];

  const fields: Field[] = [];

  customFields.forEach((field) => {
    if (field.type !== 'json') {
      fields.push({
        slug: field.slug,
        title: field.title,
      });
    }
  });

  Object.values(NATIVE_PERSON_FIELDS).map((fieldSlug) =>
    fields.push({
      slug: fieldSlug,
      title: globalMessages.personFields[fieldSlug](),
    })
  );

  const personFieldsInView = existingColumns.filter(
    (column) => column.type === COLUMN_TYPE.PERSON_FIELD
  ) as PersonFieldViewColumn[];

  const makeColumns = (slugs: string[]) => {
    return slugs.map((slug) => {
      const field = fields.find((field) => field.slug === slug);
      return {
        config: { field: slug },
        title: field ? field.title : '',
        type: COLUMN_TYPE.PERSON_FIELD,
      };
    });
  };

  return (
    <FormControl sx={{ width: 300 }}>
      <InputLabel>
        {messages.columnDialog.editor.fieldLabels.field()}
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
        renderValue={(slugs) => {
          const titles = slugs
            .map((slug) => fields.find((field) => field.slug === slug))
            .map((field) => (field ? field.title : ''));
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {titles.map((title) => {
                return <Chip key={title} label={title} />;
              })}
            </Box>
          );
        }}
        value={selectedFields}
      >
        {fields.map((field) => {
          const disabled = !!personFieldsInView.find(
            (fieldInView) => fieldInView.config.field === field.slug
          );
          return (
            <MenuItem
              key={field.slug}
              disabled={disabled}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
              value={field.slug}
            >
              {field.title}
              {disabled && (
                <Typography sx={{ fontStyle: 'italic' }} variant="body2">
                  <Msg id={messageIds.columnDialog.editor.alreadyInView} />
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
