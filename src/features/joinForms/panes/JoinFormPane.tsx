import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

import { Delete } from '@mui/icons-material';
import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PaneHeader from 'utils/panes/PaneHeader';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJoinForm from '../hooks/useJoinForm';
import { useMessages } from 'core/i18n';

type Props = {
  formId: number;
  orgId: number;
};

const JoinFormPane: FC<Props> = ({ orgId, formId }) => {
  const { data } = useJoinForm(orgId, formId);
  const messages = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);
  const [title, setTitle] = useState(data?.title ?? '');
  const [description, setDescription] = useState(data?.description ?? '');
  const [fields, setFields] = useState(
    data?.fields ?? ['first_name', 'last_name']
  );
  const customFields = useCustomFields(orgId);
  const theme = useTheme();

  if (!data) {
    return null;
  }

  function slugToLabel(slug: string): string {
    const isNativeField = Object.values(NATIVE_PERSON_FIELDS).some(
      (nativeSlug) => nativeSlug == slug
    );
    if (isNativeField) {
      const typedSlug = slug as NATIVE_PERSON_FIELDS;
      return globalMessages.personFields[typedSlug]();
    } else {
      const field = customFields.data?.find((field) => field.slug == slug);
      return field?.title ?? '';
    }
  }

  return (
    <>
      <PaneHeader title={messages.formPane.title()} />
      <Box mb={2}>
        <TextField
          fullWidth
          label={messages.formPane.labels.title()}
          onChange={(evt) => setTitle(evt.target.value)}
          value={title}
        />
      </Box>
      <Box mb={1}>
        <TextField
          fullWidth
          label={messages.formPane.labels.description()}
          onChange={(evt) => setDescription(evt.target.value)}
          value={description}
        />
      </Box>
      <Box mb={1}>
        <Autocomplete
          fullWidth
          getOptionDisabled={(option) => fields.includes(option)}
          getOptionLabel={slugToLabel}
          onChange={(ev, value) => {
            if (value) {
              setFields([...fields, value]);
            }
          }}
          options={[
            ...Object.values(NATIVE_PERSON_FIELDS),
            ...(customFields.data?.map((field) => field.slug) ?? []),
          ]}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={messages.formPane.labels.addField()}
            />
          )}
          value={null}
        />
      </Box>
      <Box>
        {fields.map((slug) => {
          return (
            <Box
              key={slug}
              display="flex"
              justifyContent="space-between"
              my={1}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.grey[200],
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                }}
              >
                {slugToLabel(slug)}
              </Box>
              {slug != 'first_name' && slug != 'last_name' && (
                <IconButton
                  onClick={() =>
                    setFields(
                      fields.filter((existingSlug) => existingSlug != slug)
                    )
                  }
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default JoinFormPane;
