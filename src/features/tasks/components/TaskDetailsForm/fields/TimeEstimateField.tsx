import { MenuItem } from '@mui/material';
import { TextField } from 'mui-rff';

import { DEFAULT_TIME_ESTIMATE, TASK_DETAILS_FIELDS } from '../constants';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/tasks/l10n/messageIds';

const TimeEstimateField: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);

  return (
    <TextField
      fullWidth
      id="estimated-time"
      label={messages.form.fields.timeEstimate()}
      margin="normal"
      name={TASK_DETAILS_FIELDS.TIME_ESTIMATE}
      required
      select
    >
      <MenuItem value={DEFAULT_TIME_ESTIMATE}>
        <Msg id={messageIds.form.fields.timeEstimateOptions.noEstimate} />
      </MenuItem>
      <MenuItem value={0}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.lessThanOneMinute}
        />
      </MenuItem>
      <MenuItem value={1}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 0, minutes: 1 }}
        />
      </MenuItem>
      <MenuItem value={3}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 0, minutes: 3 }}
        />
      </MenuItem>
      <MenuItem value={5}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 0, minutes: 5 }}
        />
      </MenuItem>
      <MenuItem value={10}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 0, minutes: 10 }}
        />
      </MenuItem>
      <MenuItem value={15}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 0, minutes: 15 }}
        />
      </MenuItem>
      <MenuItem value={30}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 0, minutes: 30 }}
        />
      </MenuItem>
      <MenuItem value={45}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 0, minutes: 45 }}
        />
      </MenuItem>
      <MenuItem value={60}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 1, minutes: 0 }}
        />
      </MenuItem>
      <MenuItem value={90}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 1, minutes: 30 }}
        />
      </MenuItem>
      <MenuItem value={120}>
        <Msg
          id={messageIds.form.fields.timeEstimateOptions.hoursAndMinutes}
          values={{ hours: 2, minutes: 0 }}
        />
      </MenuItem>
    </TextField>
  );
};

export default TimeEstimateField;
