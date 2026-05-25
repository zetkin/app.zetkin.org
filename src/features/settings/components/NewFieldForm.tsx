import slugify from 'slugify';
import { Typography, Paper, TextField, MenuItem, Button } from '@mui/material';
import { Box } from '@mui/system';
import { FC, useState } from 'react';

import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';
import useCreateField from '../hooks/useCreateField';
import Msg from 'core/i18n/Msg';
import messageIds from 'features/settings/l10n/messageIds';

export const parseEnumChoices = (input: string) => {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((label) => ({
      key: slugify(label, { lower: true, replacement: '_' }),
      label,
    }));
};

type FieldsListProps = {
  orgId: number;
};

const NewFieldForm: FC<FieldsListProps> = ({ orgId }) => {
  const createField = useCreateField(orgId);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<CUSTOM_FIELD_TYPE>(CUSTOM_FIELD_TYPE.TEXT);
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
    <Box sx={{ width: 360 }}>
      <Typography
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        sx={{
          marginBottom: '15px',
        }}
        variant="h4"
      >
        <Msg id={messageIds.fields.createNewFieldTitle} />
      </Typography>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 2,
          p: 3,
        }}
      >
        <form
          onSubmit={async (ev) => {
            ev.preventDefault();
            setCreating(true);
            await createField({
              enum_choices:
                type === CUSTOM_FIELD_TYPE.ENUM
                  ? parseEnumChoices(enumInput)
                  : undefined,
              slug,
              title,
              type,
            });
            setCreating(false);

            setEnumInput('');
            setTitle('');
            setType(CUSTOM_FIELD_TYPE.TEXT);
            setSlug('');
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Title"
              onChange={(event) => {
                setTitle(event.target.value);
                setSlug(
                  slugify(event.target.value, { lower: true, replacement: '_' })
                );
              }}
              value={title}
            />
            <TextField
              fullWidth
              label="Slug"
              onChange={(event) => {
                setSlug(
                  slugify(event.target.value, { lower: true, replacement: '_' })
                );
              }}
              value={slug}
            />
            <TextField
              fullWidth
              label="Field Type"
              onChange={(event) =>
                setType(event.target.value as CUSTOM_FIELD_TYPE)
              }
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
                fullWidth
                label="Options (comma separated list)"
                onChange={(event) => setEnumInput(event.target.value)}
                value={enumInput}
              />
            )}
            <Button
              disabled={!canCreateNewField}
              loading={creating}
              type="submit"
              variant="outlined"
            >
              Create Field
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default NewFieldForm;
