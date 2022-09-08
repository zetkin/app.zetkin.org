import { MenuItem } from '@material-ui/core';
import { TextField } from 'mui-rff';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { DEMOGRAPHICS_FIELD } from 'features/tasks/components/types';

import { COLLECT_DEMOGRAPHICS_FIELDS } from '../constants';

const CollectDemographicsFields: React.FunctionComponent = (): JSX.Element => {
  const intl = useIntl();

  return (
    <TextField
      fullWidth
      id="collect_demographics_field"
      label={intl.formatMessage({
        id: 'misc.tasks.forms.collectDemographicsConfig.fields.demographicField',
      })}
      margin="normal"
      name={COLLECT_DEMOGRAPHICS_FIELDS.FIELDS}
      select
    >
      {Object.values(DEMOGRAPHICS_FIELD).map((field) => {
        return (
          <MenuItem key={field} value={field}>
            <Msg
              id={`misc.tasks.forms.collectDemographicsConfig.fields.demographicFieldOptions.${field}`}
            />
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default CollectDemographicsFields;
