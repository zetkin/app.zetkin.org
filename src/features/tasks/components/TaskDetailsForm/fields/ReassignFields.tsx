import { MenuItem } from '@mui/material';
import { TextField } from 'mui-rff';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { DEFAULT_REASSIGN_INTERVAL, TASK_DETAILS_FIELDS } from '../constants';

const ReassignFields: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <>
      <TextField
        fullWidth
        id="reassign-interval"
        label={intl.formatMessage({
          id: 'misc.tasks.forms.createTask.fields.reassign_interval',
        })}
        margin="normal"
        name={TASK_DETAILS_FIELDS.REASSIGN_INTERVAL}
        select
      >
        <MenuItem value={DEFAULT_REASSIGN_INTERVAL}>
          <Msg id="misc.tasks.forms.createTask.fields.reassign_interval_options.noReassign" />
        </MenuItem>
        <MenuItem value={1}>
          <Msg
            id="misc.tasks.forms.createTask.fields.reassign_interval_options.hours"
            values={{ hours: 1 }}
          />
        </MenuItem>
        <MenuItem value={6}>
          <Msg
            id="misc.tasks.forms.createTask.fields.reassign_interval_options.hours"
            values={{ hours: 3 }}
          />
        </MenuItem>
        <MenuItem value={12}>
          <Msg
            id="misc.tasks.forms.createTask.fields.reassign_interval_options.hours"
            values={{ hours: 6 }}
          />
        </MenuItem>
        <MenuItem value={24}>
          <Msg
            id="misc.tasks.forms.createTask.fields.reassign_interval_options.days"
            values={{ days: 1 }}
          />
        </MenuItem>
        <MenuItem value={48}>
          <Msg
            id="misc.tasks.forms.createTask.fields.reassign_interval_options.days"
            values={{ days: 2 }}
          />
        </MenuItem>
        <MenuItem value={72}>
          <Msg
            id="misc.tasks.forms.createTask.fields.reassign_interval_options.days"
            values={{ days: 3 }}
          />
        </MenuItem>
        <MenuItem value={168}>
          <Msg
            id="misc.tasks.forms.createTask.fields.reassign_interval_options.days"
            values={{ days: 7 }}
          />
        </MenuItem>
      </TextField>

      <TextField
        fullWidth
        id="reassign-limit"
        label={intl.formatMessage({
          id: 'misc.tasks.forms.createTask.fields.reassign_limit',
        })}
        margin="normal"
        name={TASK_DETAILS_FIELDS.REASSIGN_LIMIT}
        type="number"
      />
    </>
  );
};

export default ReassignFields;
