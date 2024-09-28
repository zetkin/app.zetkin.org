import { FC, HTMLAttributes } from 'react';
import { Autocomplete, Box, Checkbox, TextField } from '@mui/material';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PaneHeader from 'utils/panes/PaneHeader';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJoinForm from '../hooks/useJoinForm';
import useJoinFormMutations from '../hooks/useJoinFormMutations';
import { useMessages } from 'core/i18n';

type Props = {
  formId: number;
  orgId: number;
};

const JoinFormPane: FC<Props> = ({ orgId, formId }) => {
  const { data: joinForm } = useJoinForm(orgId, formId);
  const { updateForm } = useJoinFormMutations(orgId, formId);
  const messages = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);
  const customFields = useCustomFields(orgId);

  if (!joinForm) {
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
          defaultValue={joinForm.title}
          fullWidth
          label={messages.formPane.labels.title()}
          onChange={(evt) => updateForm({ title: evt.target.value })}
        />
      </Box>
      <Box mb={1}>
        <TextField
          defaultValue={joinForm.description}
          fullWidth
          label={messages.formPane.labels.description()}
          onChange={(evt) => updateForm({ description: evt.target.value })}
        />
      </Box>
      <Box mb={1}>
        <Autocomplete
          disableCloseOnSelect
          fullWidth
          getOptionDisabled={(option) =>
            option === 'first_name' || option === 'last_name'
          }
          // This gets the label for selected options.
          getOptionLabel={slugToLabel}
          multiple
          onChange={(ev, value) => {
            if (value.length) {
              updateForm({
                fields: [...joinForm.fields, value[0]],
              });
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
          // This breaks the site for some reason. do we need it?
          // value={[]}
        />
      </Box>
    </>
  );
};

export default JoinFormPane;
