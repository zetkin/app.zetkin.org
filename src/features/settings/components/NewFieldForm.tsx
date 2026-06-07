import { TextField, MenuItem, Button, Alert } from '@mui/material';
import { Box } from '@mui/system';
import { FC, useState } from 'react';

import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import useCreateField from '../hooks/useCreateField';
import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import createSlug from '../utils/createSlug';
import { AccessType } from '../types';
import { getOrgReadWrite } from '../utils/orgReadWrite';

export const parseEnumChoices = (input: string) => {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((label) => ({
      key: createSlug(label),
      label,
    }));
};

type Props = {
  orgId: number;
};

const NewFieldForm: FC<Props> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const { clearFieldCreateError, createField, fieldCreateError } =
    useCreateField(orgId);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<CUSTOM_FIELD_TYPE>(CUSTOM_FIELD_TYPE.TEXT);
  const [access, setAccess] = useState<AccessType>(AccessType.ONLY_THIS_ORG);
  const [enumInput, setEnumInput] = useState('');
  const [creating, setCreating] = useState(false);

  const isBasicFieldAndHasInfo =
    type !== CUSTOM_FIELD_TYPE.ENUM && !!title && !!slug;
  const isEnumFieldAndHasInfoAndOptions =
    type == CUSTOM_FIELD_TYPE.ENUM &&
    parseEnumChoices(enumInput).length > 1 &&
    !!title &&
    !!slug;

  const canCreateNewField =
    isBasicFieldAndHasInfo || isEnumFieldAndHasInfoAndOptions;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.common.white,
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: 1,
        padding: 2,
      })}
    >
      <form
        onSubmit={async (ev) => {
          ev.preventDefault();

          const orgReadWrite = getOrgReadWrite(access);

          setCreating(true);
          await createField({
            enum_choices:
              type === CUSTOM_FIELD_TYPE.ENUM
                ? parseEnumChoices(enumInput)
                : undefined,
            slug,
            title,
            type,
            ...orgReadWrite,
          });
          setCreating(false);

          setEnumInput('');
          setTitle('');
          setType(CUSTOM_FIELD_TYPE.TEXT);
          setSlug('');
          setAccess(AccessType.ONLY_THIS_ORG);
        }}
      >
        <Box
          sx={{
            alignItems: 'flex-end',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label={messages.fields.create.titleInput()}
            onChange={(event) => {
              setTitle(event.target.value);
              setSlug(createSlug(event.target.value));
            }}
            slotProps={{ htmlInput: { maxLength: 300 } }}
            value={title}
          />
          <TextField
            fullWidth
            helperText={messages.fields.create.slugInputHelper()}
            label={messages.fields.create.slugInput()}
            onChange={(event) => {
              setSlug(createSlug(event.target.value));
            }}
            slotProps={{ htmlInput: { maxLength: 40 } }}
            value={slug}
          />
          <TextField
            fullWidth
            label={messages.fields.create.typeInput()}
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
              fullWidth
              label={messages.fields.edit.optionsInput()}
              onChange={(event) => setEnumInput(event.target.value)}
              value={enumInput}
            />
          )}
          <TextField
            fullWidth
            helperText={messages.fields.create.accessInputHelper()}
            label={messages.fields.create.accessInput()}
            onChange={(event) => {
              const value = event.target.value as AccessType;
              setAccess(value);
            }}
            select
            value={access}
          >
            {Object.values(AccessType).map((option) => (
              <MenuItem key={option} value={option}>
                <Msg id={messageIds.fields.accessTypes[option]} />
              </MenuItem>
            ))}
          </TextField>
          <Button
            disabled={!canCreateNewField}
            loading={creating}
            type="submit"
            variant="outlined"
          >
            <Msg id={messageIds.fields.create.createButton} />
          </Button>
        </Box>
      </form>
      {fieldCreateError && (
        <Box sx={{ paddingTop: 1 }}>
          <Alert
            onClose={() => {
              clearFieldCreateError();
            }}
            severity="error"
          >
            <Msg id={messageIds.fields.create.errorMessage} />
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default NewFieldForm;
