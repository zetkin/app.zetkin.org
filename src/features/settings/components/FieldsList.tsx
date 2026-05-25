import React, { Fragment, Suspense, useContext, useState } from 'react';
import {
  Button,
  Collapse,
  Divider,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';
import slugify from 'slugify';

import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useFieldMutations from '../hooks/useFieldMutations';
import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import useMessages from 'core/i18n/useMessages';
import globalMessageIds from 'core/i18n/messageIds';
import { parseEnumChoices } from './NewFieldForm';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import useCustomField from '../hooks/useCustomField';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

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
  const messages = useMessages(messageIds);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
      <Typography variant="h6">
        <Msg
          id={messageIds.fields.edit.title}
          values={{ fieldTitle: field.title }}
        />
      </Typography>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={messages.fields.edit.titleInput()}
            onChange={(event) => {
              setTitle(event.target.value);
              setSlug(
                slugify(event.target.value, { lower: true, replacement: '_' })
              );
            }}
            value={title}
          />
          <TextField
            label={messages.fields.edit.slugInput()}
            onChange={(event) =>
              setSlug(
                slugify(event.target.value, { lower: true, replacement: '_' })
              )
            }
            value={slug}
          />
          <TextField
            label={messages.fields.edit.typeInput()}
            onChange={(event) =>
              setType(event.target.value as CUSTOM_FIELD_TYPE)
            }
            select
            value={type}
          >
            {Object.values(CUSTOM_FIELD_TYPE).map((option) => (
              <MenuItem key={option} value={option}>
                <Msg id={messageIds.fields.customFieldTypes[option]} />
              </MenuItem>
            ))}
          </TextField>
          {type === CUSTOM_FIELD_TYPE.ENUM && (
            <TextField
              label={messages.fields.edit.optionsInput()}
              onChange={(event) => setEnumOptions(event.target.value)}
              value={enumOptions}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() =>
                showConfirmDialog({
                  onSubmit: () => {
                    removeField(fieldId);
                    onDelete();
                  },
                  submitText: messages.fields.confirmDeletion.confirmButton({
                    fieldTitle: field.title,
                  }),
                  title: messages.fields.confirmDeletion.title({
                    fieldTitle: field.title,
                  }),
                  warningText: messages.fields.confirmDeletion.warningText({
                    fieldTitle: field.title,
                  }),
                })
              }
              variant="outlined"
            >
              <Msg id={messageIds.fields.edit.deleteButton} />
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => {
                  onCancel();
                }}
                variant="outlined"
              >
                <Msg id={messageIds.fields.edit.cancelButton} />
              </Button>
              <Button
                disabled={!changesHaveBeenMade}
                loading={updating}
                type="submit"
                variant="contained"
              >
                <Msg id={messageIds.fields.edit.saveButton} />
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

type Props = {
  orgId: number;
};

const FieldsList: FC<Props> = ({ orgId }) => {
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);
  const [fieldBeingEdited, setFieldBeingEdited] = useState<number | null>(null);

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.common.white,
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: 1,
      })}
    >
      <Box sx={{ display: 'flex', padding: 2 }}>
        <Typography sx={{ flex: 1 }} variant="h5">
          <Msg id={messageIds.fields.list.headers.title} />
        </Typography>
        <Typography sx={{ flex: 1 }} variant="h5">
          <Msg id={messageIds.fields.list.headers.slug} />
        </Typography>
        <Typography sx={{ flex: 1 }} variant="h5">
          <Msg id={messageIds.fields.list.headers.type} />
        </Typography>
      </Box>
      <Divider />
      {Object.entries(NATIVE_PERSON_FIELDS).map(([key, value]) => {
        const slug = value as NATIVE_PERSON_FIELDS;

        return (
          <Fragment key={value}>
            <Box sx={{ display: 'flex', padding: 2 }}>
              <Typography sx={{ flex: 1 }}>
                {globalMessages.personFields[slug]()}
              </Typography>
              <Typography color="secondary" sx={{ flex: 1 }}>
                {key.toLowerCase()}
              </Typography>
              <Typography color="secondary" sx={{ flex: 1 }}>
                <Msg id={messageIds.fields.customFieldTypes.text} />
              </Typography>
            </Box>
            <Divider />
          </Fragment>
        );
      })}
      {customFields.map((field, index) => {
        const showEditButton = field.organization.id === orgId;
        return (
          <Fragment key={field.slug}>
            <Collapse in={fieldBeingEdited === field.id}>
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
            </Collapse>
            {fieldBeingEdited !== field.id && (
              <Box sx={{ alignItems: 'center', display: 'flex', padding: 2 }}>
                <Typography sx={{ flex: 1 }}>{field.title}</Typography>
                <Typography color="secondary" sx={{ flex: 1 }}>
                  {field.slug}
                </Typography>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography color="secondary" sx={{ flex: 1 }}>
                    <Msg id={messageIds.fields.customFieldTypes[field.type]} />
                  </Typography>
                  {showEditButton && fieldBeingEdited !== field.id && (
                    <Button
                      onClick={() => setFieldBeingEdited(field.id)}
                      variant="text"
                    >
                      <Msg id={messageIds.fields.list.editButton} />
                    </Button>
                  )}
                </Box>
              </Box>
            )}
            {index !== customFields.length - 1 && <Divider />}
          </Fragment>
        );
      })}
    </Box>
  );
};

export default FieldsList;
