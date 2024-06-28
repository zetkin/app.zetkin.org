import { MenuItem } from '@mui/material';
import { TextField } from 'mui-rff';

import { DEFAULT_REASSIGN_INTERVAL, TASK_DETAILS_FIELDS } from '../constants';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';

const ReassignFields: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  return (
    <>
      <TextField
        fullWidth
        id="reassign-interval"
        label={messages.form.fields.reassignInterval()}
        margin="normal"
        name={TASK_DETAILS_FIELDS.REASSIGN_INTERVAL}
        select
      >
        <MenuItem value={DEFAULT_REASSIGN_INTERVAL}>
          <Msg id={messageIds.form.fields.reassignIntervalOptions.noReassign} />
        </MenuItem>
        <MenuItem value={1}>
          <Msg
            id={messageIds.form.fields.reassignIntervalOptions.hours}
            values={{ hours: 1 }}
          />
        </MenuItem>
        <MenuItem value={6}>
          <Msg
            id={messageIds.form.fields.reassignIntervalOptions.hours}
            values={{ hours: 3 }}
          />
        </MenuItem>
        <MenuItem value={12}>
          <Msg
            id={messageIds.form.fields.reassignIntervalOptions.hours}
            values={{ hours: 6 }}
          />
        </MenuItem>
        <MenuItem value={24}>
          <Msg
            id={messageIds.form.fields.reassignIntervalOptions.days}
            values={{ days: 1 }}
          />
        </MenuItem>
        <MenuItem value={48}>
          <Msg
            id={messageIds.form.fields.reassignIntervalOptions.days}
            values={{ days: 2 }}
          />
        </MenuItem>
        <MenuItem value={72}>
          <Msg
            id={messageIds.form.fields.reassignIntervalOptions.days}
            values={{ days: 3 }}
          />
        </MenuItem>
        <MenuItem value={168}>
          <Msg
            id={messageIds.form.fields.reassignIntervalOptions.days}
            values={{ days: 7 }}
          />
        </MenuItem>
      </TextField>

      <TextField
        fullWidth
        id="reassign-limit"
        label={messages.form.fields.reassignLimit()}
        margin="normal"
        name={TASK_DETAILS_FIELDS.REASSIGN_LIMIT}
        type="number"
      />
    </>
  );
};

export default ReassignFields;
