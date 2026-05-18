import React, { useState } from 'react';
import { Button, MenuItem, Paper, TextField } from '@mui/material';
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
          <Box
            sx={{
              borderBottom: '1px solid #e5e5e5',
              display: 'grid',
              fontWeight: 600,
              gridTemplateColumns: '2fr 2fr 1fr auto',
              px: 1,
              py: 1,
            }}
          >
            <Box>Title</Box>
            <Box>Slug</Box>
            <Box>Type</Box>
            <Box />
          </Box>

          <Box display="flex" flexDirection="column">
            <Box sx={{ flex: 1 }}>
              <Box display="flex" flexDirection="column" gap={1} mt={2}>
                {Object.entries(NATIVE_PERSON_FIELDS).map(([key, value]) => (
                  <Box key={value} sx={{ borderBottom: '1px solid #e5e5e5' }}>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 1fr auto',
                        px: 1,
                        py: 1.5,
                      }}
                    >
                      <Box>{value}</Box>
                      <Box>{key}</Box>
                      <Box />
                      <Box />
                    </Box>
                  </Box>
                ))}
                {customFields.map((field) => (
                  <Box
                    key={field.slug}
                    sx={{ borderBottom: '1px solid #e5e5e5' }}
                  >
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 1fr auto',
                        px: 1,
                        py: 1.5,
                      }}
                    >
                      <Box>{field.title}</Box>
                      <Box>{field.slug}</Box>
                      <Box>{field.type}</Box>

                      {updatedFieldId !== field.id && (
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
                          size="small"
                          variant="outlined"
                        >
                          Edit
                        </Button>
                      )}
                    </Box>

                    {updatedFieldId === field.id && (
                      <Box display="flex" flexDirection="column" gap={1}>
                        <TextField
                          label="Title"
                          onChange={(event) =>
                            setUpdatedTitle(event.target.value)
                          }
                          value={updatedTitle}
                        />

                        <TextField
                          label="slug"
                          onChange={(event) =>
                            setUpdatedSlug(event.target.value)
                          }
                          value={updatedSlug}
                        />

                        <TextField
                          label="Field Type"
                          onChange={(event) =>
                            setUpdatedType(
                              event.target.value as CUSTOM_FIELD_TYPE
                            )
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

                        <Box display="flex" mt={1}>
                          <Button
                            onClick={() => removeField(field.id)}
                            size="small"
                            variant="outlined"
                          >
                            Delete Field
                          </Button>

                          <Box display="flex" gap={1} ml="auto">
                            <Button
                              onClick={() => {
                                setUpdatedFieldId(null);
                              }}
                              size="small"
                              variant="outlined"
                            >
                              Cancel
                            </Button>

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
                              size="small"
                              variant="contained"
                            >
                              Save
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* RIGHT SIDE*/}
        <Box sx={{ width: 360 }}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                id="filled-basic"
                label="Title"
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                sx={{ backgroundColor: '#f9f9f9' }}
                value={title}
              />

              <TextField
                fullWidth
                id="filled-basic"
                label="Slug"
                onChange={(event) => {
                  setSlug(event.target.value);
                }}
                sx={{ backgroundColor: '#f9f9f9' }}
                value={slug}
              />

              <TextField
                fullWidth
                id="filled-basic"
                label="Type"
                onChange={(event) =>
                  setType(event.target.value as CUSTOM_FIELD_TYPE)
                }
                select
                sx={{ backgroundColor: '#f9f9f9' }}
                value={type}
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
                  label="Options (comma separated list)"
                  onChange={(event) => setEnumInput(event.target.value)}
                  sx={{ backgroundColor: '#f9f9f9' }}
                  value={enumInput}
                />
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
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
                  size="small"
                  variant="outlined"
                >
                  Create Field
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FieldsList;
