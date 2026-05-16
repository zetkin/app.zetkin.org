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
  const { updateField: updateField, removeField } = useFieldMutations(orgId);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<CUSTOM_FIELD_TYPE>(CUSTOM_FIELD_TYPE.TEXT);
  const [enumInput, setEnumInput] = useState('');
  const [updatedFieldId, setUpdatedFieldId] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedType, setUpdatedType] = useState<CUSTOM_FIELD_TYPE>(
    CUSTOM_FIELD_TYPE.TEXT
  );
  const [updatedEnumInput, setUpdatedEnumInput] = useState('');
  const [updatedSlug, setUpdatedSlug] = useState('');

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
    <Box sx={{ backgroundColor: '#f7f7f7', minHeight: '100vh', p: 4 }}>
      <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 3 }}>
        {/* LEFT SIDE*/}
        <Box sx={{ flex: 1 }}>
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
              <Box
                key={field.slug}
                display="flex"
                flexDirection="column"
                gap={1}
              >
                <Typography>{field.title}</Typography>

                {field.type === CUSTOM_FIELD_TYPE.ENUM &&
                  field.enum_choices?.map((choice) => (
                    <Typography key={choice.key}>- {choice.label}</Typography>
                  ))}

                <Button
                  onClick={() => {
                    setUpdatedFieldId(field.id);
                    setUpdatedTitle(field.title);
                    setUpdatedType(field.type);
                    setUpdatedSlug(field.slug);

                    if (field.enum_choices) {
                      setUpdatedEnumInput(
                        field.enum_choices
                          .map((choice) => choice.label)
                          .join(', ')
                      );
                    }
                  }}
                >
                  Edit Field
                </Button>

                {updatedFieldId === field.id && (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <TextField
                      label="Title"
                      onChange={(event) => setUpdatedTitle(event.target.value)}
                      value={updatedTitle}
                    />

                    <TextField
                      label="slug"
                      onChange={(event) => setUpdatedSlug(event.target.value)}
                      value={updatedSlug}
                    />

                    <TextField
                      label="Type"
                      onChange={(event) =>
                        setUpdatedType(event.target.value as CUSTOM_FIELD_TYPE)
                      }
                      select
                      value={updatedType}
                    >
                      {Object.values(CUSTOM_FIELD_TYPE).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>

                    {updatedType === CUSTOM_FIELD_TYPE.ENUM && (
                      <TextField
                        label="Enum values (comma separated)"
                        onChange={(event) =>
                          setUpdatedEnumInput(event.target.value)
                        }
                        value={updatedEnumInput}
                      />
                    )}

                    <Button
                      onClick={() => {
                        updateField(
                          {
                            enum_choices:
                              updatedType === CUSTOM_FIELD_TYPE.ENUM
                                ? parseEnumChoices(updatedEnumInput)
                                : undefined,
                            slug: updatedSlug,
                            title: updatedTitle,
                            type: updatedType,
                          },
                          field.id
                        );

                        setUpdatedFieldId(null);
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                )}

                <Button onClick={() => removeField(field.id)}>remove</Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* RIGHT SIDE*/}
        <Box sx={{ width: 360 }}>
          <TextField
            id="filled-basic"
            label="title"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            value={title}
            variant="filled"
          />

          <TextField
            id="filled-basic"
            label="slug"
            onChange={(event) => {
              setSlug(event.target.value);
            }}
            value={slug}
            variant="filled"
          />

          <TextField
            id="filled-basic"
            label="type"
            onChange={(event) =>
              setType(event.target.value as CUSTOM_FIELD_TYPE)
            }
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

          {type === CUSTOM_FIELD_TYPE.ENUM && (
            <TextField
              fullWidth
              id="filled-basic"
              label="Enum values (comma separated)"
              onChange={(event) => setEnumInput(event.target.value)}
              value={enumInput}
              variant="filled"
            />
          )}

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
      </Box>
    </Box>
  );
};

export default FieldsList;
