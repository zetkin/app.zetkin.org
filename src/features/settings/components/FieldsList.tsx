import React, { Suspense, useContext, useState } from 'react';
import {
  Button,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useServerSide from 'core/useServerSide';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useFieldMutations from '../hooks/useFieldMutations';
import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import useMessages from 'core/i18n/useMessages';
import globalMessageIds from 'core/i18n/messageIds';
import Msg from 'core/i18n/Msg';
import messageIds from 'features/settings/l10n/messageIds';
import { parseEnumChoices } from './NewFieldForm';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import useCustomField from '../hooks/useCustomField';

type EditFieldFormProps = {
  fieldId: number;
  onCancel: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  orgId: number;
};

const EditFieldForm: FC<EditFieldFormProps> = ({
  onCancel,
  onDelete,
  onSubmit,
  orgId,
  fieldId,
}) => {
  const field = useCustomField(orgId, fieldId);
  const { updateField, removeField } = useFieldMutations(orgId);

  const [updating, setUpdating] = useState(false);
  const [title, setTitle] = useState(field.title);
  const [slug, setSlug] = useState(field.slug);
  const [type, setType] = useState(field.type);
  const initialEnumOptions =
    field.enum_choices?.map((choice) => choice.label).join(', ') || '';
  const [enumOptions, setEnumOptions] = useState(initialEnumOptions);

  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const changesHaveBeenMade =
    title !== field.title ||
    slug !== field.slug ||
    type !== field.type ||
    enumOptions !== initialEnumOptions;

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();
        setUpdating(true);
        await updateField(fieldId, {
          enum_choices:
            enumOptions !== initialEnumOptions
              ? parseEnumChoices(enumOptions)
              : undefined,
          slug: slug !== field.slug ? slug : undefined,
          title: title !== field.title ? title : undefined,
          type: type !== field.type ? type : undefined,
        });
        setUpdating(false);
        onSubmit();
      }}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <TextField
          label="Title"
          onChange={(event) => {
            setTitle(event.target.value);
            setSlug(
              event.target.value.toLowerCase().trim().replace(/\s+/g, '_')
            );
          }}
          value={title}
        />
        <TextField
          label="Slug"
          onChange={(event) =>
            setSlug(
              event.target.value.toLowerCase().trim().replace(/\s+/g, '_')
            )
          }
          value={slug}
        />
        <TextField
          label="Field Type"
          onChange={(event) => setType(event.target.value as CUSTOM_FIELD_TYPE)}
          select
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
            label="Options (comma separated)"
            onChange={(event) => setEnumOptions(event.target.value)}
            value={enumOptions}
          />
        )}
        <Box display="flex" mt={1}>
          <Button
            onClick={() =>
              showConfirmDialog({
                onSubmit: () => {
                  removeField(fieldId);
                  onDelete();
                },
                submitText: 'Delete ' + field.title,
                title: 'Delete ' + field.title + '?',
                warningText: 'Are you sure you want to delete ' + field.title,
              })
            }
            size="small"
            variant="outlined"
          >
            Delete Field
          </Button>
          <Box display="flex" gap={1} ml="auto">
            <Button
              onClick={() => {
                onCancel();
              }}
              size="small"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              disabled={!changesHaveBeenMade}
              loading={updating}
              size="small"
              type="submit"
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

type FieldsListProps = {
  orgId: number;
};

const FieldsList: FC<FieldsListProps> = ({ orgId }) => {
  const onServer = useServerSide();
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);
  const [fieldBeingEdited, setFieldBeingEdited] = useState<number | null>(null);

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
        {customFields.map((field) => {
          const showEditButton = field.organization.id === orgId;
          return (
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
                {showEditButton && fieldBeingEdited !== field.id && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      onClick={() => setFieldBeingEdited(field.id)}
                      size="small"
                      variant="outlined"
                    >
                      Edit
                    </Button>
                  </Box>
                )}
              </Box>
              {fieldBeingEdited === field.id && (
                <Suspense fallback={<Skeleton />}>
                  <EditFieldForm
                    fieldId={field.id}
                    onCancel={() => setFieldBeingEdited(null)}
                    onDelete={() => {
                      setFieldBeingEdited(null);
                    }}
                    onSubmit={() => {
                      setFieldBeingEdited(null);
                    }}
                    orgId={orgId}
                  />
                </Suspense>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FieldsList;
