import { MenuItem } from '@mui/material';
import { TextField } from 'mui-rff';

import { COLLECT_DEMOGRAPHICS_FIELDS } from '../constants';
import { DEMOGRAPHICS_FIELD } from 'features/tasks/components/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';

const CollectDemographicsFields: React.FunctionComponent = (): JSX.Element => {
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
      name={COLLECT_DEMOGRAPHICS_FIELDS.FIELDS}
      select
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
