import { MenuItem } from '@material-ui/core';
import { TextField } from 'mui-rff';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { DEFAULT_TIME_ESTIMATE, TASK_DETAILS_FIELDS } from '../constants';

const TimeEstimateField: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <TextField
            fullWidth
            id="estimated-time"
            label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.time_estimate' }) }
            margin="normal"
            name={ TASK_DETAILS_FIELDS.TIME_ESTIMATE }
            required
            select>
            <MenuItem value={ DEFAULT_TIME_ESTIMATE }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.noEstimate" />
            </MenuItem>
            <MenuItem value={ 0 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.lessThanOneMinute" />
            </MenuItem>
            <MenuItem value={ 1 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 0, minutes: 1 }} />
            </MenuItem>
            <MenuItem value={ 3 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 0, minutes: 3 }} />
            </MenuItem>
            <MenuItem value={ 5 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 0, minutes: 5 }} />
            </MenuItem>
            <MenuItem value={ 10 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 0, minutes: 10 }} />
            </MenuItem>
            <MenuItem value={ 15 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 0, minutes: 15 }} />
            </MenuItem>
            <MenuItem value={ 30 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 0, minutes: 30 }} />
            </MenuItem>
            <MenuItem value={ 45 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 0, minutes: 45 }} />
            </MenuItem>
            <MenuItem value={ 60 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 1, minutes: 0 }} />
            </MenuItem>
            <MenuItem value={ 90 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 1, minutes: 30 }} />
            </MenuItem>
            <MenuItem value={ 120 }>
                <Msg id="misc.tasks.forms.createTask.fields.time_estimate_options.hoursAndMinutes" values={{ hours: 2, minutes: 0 }} />
            </MenuItem>
        </TextField>
    );
};

export default TimeEstimateField;
