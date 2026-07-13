import { MenuItem, TextField } from '@mui/material';

import { DEMOGRAPHICS_FIELD } from 'features/tasks/components/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';

type Props = {
  onChange: (value: DEMOGRAPHICS_FIELD | undefined) => void;
  value?: DEMOGRAPHICS_FIELD;
};

const CollectDemographicsFields: React.FunctionComponent<Props> = ({
  value,
  onChange,
}): JSX.Element => {
  const messages = useMessages(messageIds);

  const fieldMessages = {
    city: 'city',
    country: 'country',
    email: 'email',
    street_address: 'streetAddress',
    zip_code: 'zipCode',
  } as const;

  return (
    <TextField
      fullWidth
      id="collect_demographics_field"
      label={messages.configs.collectDemographics.fields.demographic()}
      margin="normal"
      onChange={(e) =>
        onChange((e.target.value as DEMOGRAPHICS_FIELD) || undefined)
      }
      select
      value={value ?? ''}
    >
      {Object.values(DEMOGRAPHICS_FIELD).map((field) => {
        const msgName = fieldMessages[field];
        return (
          <MenuItem key={field} value={field}>
            <Msg
              id={
                messageIds.configs.collectDemographics.fields
                  .dempographicOptions[msgName]
              }
            />
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default CollectDemographicsFields;
