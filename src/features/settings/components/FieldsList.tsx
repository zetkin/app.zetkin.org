import React, { useState } from 'react';
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useServerSide from 'core/useServerSide';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useFieldMutations from '../hooks/useFieldMutations';
import useCreateField from '../hooks/useCreateField';
import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';

type FieldsListProps = {
  orgId: number;
};

const FieldsList: FC<FieldsListProps> = ({ orgId }) => {
  const onServer = useServerSide();
  const customFields = useCustomFields(orgId).data ?? [];
  const { createField } = useCreateField(orgId);
  const { removeField } = useFieldMutations(orgId);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CUSTOM_FIELD_TYPE>(CUSTOM_FIELD_TYPE.TEXT);
  const [enumInput, setEnumInput] = useState('');

  const parseEnumChoices = (input: string) => {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((label) => ({
        key: label.toLowerCase().replace(/\s+/g, '_'),
        label,
      }));
  };

  if (onServer) {
    return null;
  }

  return (
    <Box>
      <Box>
        <TextField
          id="filled-basic"
          label="title"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          value={title}
          variant="filled"
        />
      </Box>
      <Box>
        <TextField
          id="filled-basic"
          label="type"
          onChange={(event) => setType(event.target.value as CUSTOM_FIELD_TYPE)}
          select
          value={type}
          variant="filled"
        >
          {Object.values(CUSTOM_FIELD_TYPE).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {type === CUSTOM_FIELD_TYPE.ENUM && (
        <Box>
          <TextField
            fullWidth
            id="filled-basic"
            label="Enum values (comma separated)"
            onChange={(event) => setEnumInput(event.target.value)}
            value={enumInput}
            variant="filled"
          />
        </Box>
      )}

      <Box>
        <Button
          onClick={() =>
            createField(
              title,
              type,
              type === CUSTOM_FIELD_TYPE.ENUM
                ? parseEnumChoices(enumInput)
                : undefined
            )
          }
        >
          Create Field
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        {Object.entries(NATIVE_PERSON_FIELDS).map(([key, value]) => (
          <Box key={key} display="flex" gap={1}>
            <Box>{key}</Box>
            <Box>{value}</Box>
          </Box>
        ))}
      </Box>
      <Box display="flex" flexDirection="column" gap={1} mt={2}>
        {customFields.map((field) => (
          <Box key={field.slug} display="flex" flexDirection="column" gap={1}>
            <Typography>{field.title}</Typography>

            {field.type === CUSTOM_FIELD_TYPE.ENUM &&
              field.enum_choices?.map((choice) => (
                <Typography key={choice.key}>- {choice.label}</Typography>
              ))}

            <Button onClick={() => removeField(field.id)}>remove</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FieldsList;
