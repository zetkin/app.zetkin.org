import React, { useState } from 'react';
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useServerSide from 'core/useServerSide';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useFieldMutations from '../hooks/useFieldMutations';
import {
  CUSTOM_FIELD_TYPE,
  EnumChoice,
  ZetkinCustomField,
} from 'utils/types/zetkin';
import useMessages from 'core/i18n/useMessages';
import globalMessageIds from 'core/i18n/messageIds';
import Msg from 'core/i18n/Msg';
import messageIds from 'features/settings/l10n/messageIds';

type FieldsListProps = {
  orgId: number;
};

const FieldsList: FC<FieldsListProps> = ({ orgId }) => {
  const onServer = useServerSide();
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);
  const { updateField: updateField, removeField } = useFieldMutations(orgId);
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

  const handleFieldPayload = (
    field: ZetkinCustomField
  ): {
    enum_choices?: EnumChoice[];
    slug?: string;
    title?: string;
    type?: CUSTOM_FIELD_TYPE;
  } => {
    const enumChoices =
      updatedType === CUSTOM_FIELD_TYPE.ENUM
        ? parseEnumChoices(updatedEnumInput)
        : undefined;

    const originalEnumInput =
      field.enum_choices?.map((choice) => choice.label).join(', ') ?? '';

    return {
      enum_choices:
        updatedEnumInput !== originalEnumInput ? enumChoices : undefined,
      slug: updatedSlug !== field.slug ? updatedSlug : undefined,
      title: updatedTitle !== field.title ? updatedTitle : undefined,
      type: updatedType !== field.type ? updatedType : undefined,
    };
  };

  if (onServer) {
    return null;
  }

  return (
    <Box>
      <Typography
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        sx={{
          flex: 1,
          marginBottom: '15px',
        }}
        variant="h4"
      >
        <Msg id={messageIds.fields.fieldsTitle} />
      </Typography>
      <Box
        sx={{
          borderBottom: '1px solid #e5e5e5',
          display: 'grid',
          fontWeight: 600,
          gridTemplateColumns: '2fr 2fr 1fr 1fr',
          px: 1,
          py: 1,
        }}
      >
        <Box>Title</Box>
        <Box>Slug</Box>
        <Box>Type</Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1} mt={2}>
        {Object.entries(NATIVE_PERSON_FIELDS).map(([key, value]) => {
          const slug = value as NATIVE_PERSON_FIELDS;

          return (
            <Box
              key={value}
              sx={{
                alignItems: 'center',
                borderBottom: '1px solid #e5e5e5',
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr',
                px: 1,
                py: 1.5,
              }}
            >
              <Box>{globalMessages.personFields[slug]()}</Box>
              <Box>{key.toLowerCase()}</Box>
              <Box>text</Box>
            </Box>
          );
        })}

        {customFields.map((field) => (
          <Box key={field.slug}>
            <Box
              sx={{
                alignItems: 'center',
                borderBottom: '1px solid #e5e5e5',
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr',
                px: 1,
                py: 1.5,
              }}
            >
              <Box>{field.title}</Box>
              <Box>{field.slug}</Box>
              <Box>{field.type}</Box>

              {updatedFieldId !== field.id && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                </Box>
              )}
            </Box>

            {updatedFieldId === field.id && (
              <Box display="flex" flexDirection="column" gap={1}>
                <TextField
                  label="Title"
                  onChange={(event) => setUpdatedTitle(event.target.value)}
                  value={updatedTitle}
                />

                <TextField
                  label="Slug"
                  onChange={(event) => setUpdatedSlug(event.target.value)}
                  value={updatedSlug}
                />

                <TextField
                  label="Field Type"
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
                    label="Options (comma separated)"
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
                        const payload = handleFieldPayload(field);

                        if (
                          Object.values(payload).every(
                            (value) => value === undefined
                          )
                        ) {
                          setUpdatedFieldId(null);
                          return;
                        }

                        updateField(payload, field.id);
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
  );
};

export default FieldsList;
