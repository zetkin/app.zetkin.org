import { MenuItem, TextField } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';

type Props = {
  onChange: (value: number | null) => void;
  value: number | null;
};

const DEFAULT_REASSIGN_INTERVAL = 'noInterval'; // Gets mapped to null when saving if this is selected value

const ReassignFields: React.FunctionComponent<Props> = ({
  value,
  onChange,
}) => {
  const messages = useMessages(messageIds);
  const internalValue = value === null ? DEFAULT_REASSIGN_INTERVAL : value;

  return (
    <TextField
      fullWidth
      id="reassign-interval"
      label={messages.form.fields.reassignInterval()}
      margin="normal"
      onChange={(e) =>
        onChange(
          e.target.value === DEFAULT_REASSIGN_INTERVAL
            ? null
            : parseInt(e.target.value)
        )
      }
      select
      value={internalValue}
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
  );
};

export default ReassignFields;
