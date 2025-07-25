import { FC, HTMLAttributes } from 'react';
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
} from '@mui/material';

import globalMessageIds from 'core/i18n/messageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PaneHeader from 'utils/panes/PaneHeader';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJoinForm from '../hooks/useJoinForm';
import useJoinFormMutations from '../hooks/useJoinFormMutations';
import { useMessages } from 'core/i18n';
import useDebounce from 'utils/hooks/useDebounce';

type Props = {
  formId: number;
  orgId: number;
};

const JoinFormPane: FC<Props> = ({ orgId, formId }) => {
  const { data: joinForm } = useJoinForm(orgId, formId);
  const { updateForm } = useJoinFormMutations(orgId, formId);
  const updateFormDebounced = useDebounce(updateForm, 200);
  const messages = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);
  const customFields = useCustomFields(orgId);

  const nativePersonFields = Object.values(NATIVE_PERSON_FIELDS).filter(
    (field) =>
      field !== NATIVE_PERSON_FIELDS.EXT_ID && field !== NATIVE_PERSON_FIELDS.ID
  );

  if (!joinForm) {
    return null;
  }

  function slugToLabel(slug: string): string {
    const isNativeField = nativePersonFields.some(
      (nativeSlug) => nativeSlug == slug
    );
    if (isNativeField) {
      const typedSlug = slug as typeof nativePersonFields[number];
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
          defaultValue={joinForm.title}
          fullWidth
          label={messages.formPane.labels.title()}
          onChange={(evt) => updateFormDebounced({ title: evt.target.value })}
        />
      </Box>
      <Box mb={1}>
        <TextField
          defaultValue={joinForm.description}
          fullWidth
          label={messages.formPane.labels.description()}
          onChange={(evt) =>
            updateFormDebounced({ description: evt.target.value })
          }
        />
      </Box>
      <Box mb={1}>
        <Autocomplete
          disableCloseOnSelect
          fullWidth
          getOptionDisabled={(option) => joinForm.fields.includes(option)}
          // This gets the label for selected options.
          getOptionLabel={slugToLabel}
          multiple
          onChange={(ev, values) => {
            if (values.length > 0) {
              updateFormDebounced({
                fields: values,
              });
            }
            if (values.length === 0) {
              updateFormDebounced({
                fields: ['first_name', 'last_name'],
              });
            } else {
              return;
            }
          }}
          options={[
            ...nativePersonFields,
            ...(customFields.data?.map((field) => field.slug) ?? []),
          ]}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={messages.formPane.labels.addField()}
            />
          )}
          renderOption={(props, option, { selected }) => {
            // Type assertion needed due to currently used version of mui/material missing key prop in renderOption.
            // This is fixed in later versions.
            // https://github.com/mui/material-ui/issues/39833
            const { key, ...optionProps } =
              props as HTMLAttributes<HTMLLIElement> & { key: string };
            return (
              <li key={key} {...optionProps}>
                <Checkbox checked={selected} />
                {/* This gets the label for options. */}
                {slugToLabel(option)}
              </li>
            );
          }}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={slugToLabel(option)}
                  {...tagProps}
                  disabled={
                    (joinForm.requires_email_verification &&
                      option === NATIVE_PERSON_FIELDS.EMAIL) ||
                    option === NATIVE_PERSON_FIELDS.FIRST_NAME ||
                    option === NATIVE_PERSON_FIELDS.LAST_NAME
                  }
                />
              );
            })
          }
          value={joinForm.fields}
        />
      </Box>
      <Box mb={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={joinForm.requires_email_verification}
              onChange={(evt) =>
                updateFormDebounced({
                  fields:
                    evt.target.checked &&
                    !joinForm?.fields.includes(NATIVE_PERSON_FIELDS.EMAIL)
                      ? [
                          ...(joinForm?.fields ?? []),
                          NATIVE_PERSON_FIELDS.EMAIL,
                        ]
                      : undefined,
                  requires_email_verification: evt.target.checked,
                })
              }
            />
          }
          label={messages.formPane.labels.requireEmailVerification()}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={joinForm.org_access == 'suborgs'}
              onChange={(evt) =>
                updateFormDebounced({
                  org_access: evt.target.checked ? 'suborgs' : 'sameorg',
                })
              }
            />
          }
          label={messages.formPane.labels.shareWithSuborgs()}
        />
      </Box>
    </>
  );
};

export default JoinFormPane;
