import { Form } from 'react-final-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, MenuItem } from '@material-ui/core';
import { DateTimePicker, TextField } from 'mui-rff';
import { FormattedMessage, FormattedMessage as Msg, useIntl } from 'react-intl';

import getCampaigns from 'fetching/getCampaigns';
import { TASK_TYPE } from 'types/tasks';
import { ZetkinTask } from 'types/zetkin';
import { ZetkinTaskRequestBody } from 'types/tasks';

import CollectDemographicsFields from './typeConfigFields/CollectDemographicsFields';
import { TASK_DETAILS_FIELDS } from './constants';
import { isDeadlineSecond, isExpiresThird, isPublishedFirst } from './utils';

interface TaskDetailsFormProps {
    onSubmit: (task: ZetkinTaskRequestBody) => void;
    onCancel: () => void;
    task?: ZetkinTask;
}

const TaskDetailsForm = ({ onSubmit, onCancel, task }: TaskDetailsFormProps): JSX.Element => {
    const router = useRouter();
    const { campId, orgId } = router.query as {campId: string; orgId: string};
    const intl = useIntl();
    const { data: campaigns } = useQuery(['campaigns', orgId], getCampaigns(orgId));

    const validate = (values: ZetkinTaskRequestBody) => {
        const errors: Record<string, string> = {};
        if (!values.title) {
            errors.title = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        if (!values.type) {
            errors.type = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        if (!values.instructions) {
            errors.instructions = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        if (!values.campaign_id) {
            errors.campaign_id = intl.formatMessage({ id: 'misc.formDialog.required' });
        }

        // Validate dates are in correct order
        if (!isPublishedFirst(values)) {
            errors.published = intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.timeValidationErrors.publishedNotFirst' });
        }
        if (!isDeadlineSecond(values)) {
            errors.deadline = intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.timeValidationErrors.deadlineNotSecond' });
        }
        if (!isExpiresThird(values)) {
            errors.expires = intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.timeValidationErrors.expiresNotThird' });
        }

        return errors;
    };

    const submit = (newTaskValues: ZetkinTaskRequestBody) => {
        onSubmit({
            ...newTaskValues,
            config:
                // If task type changes and no new config values
                task?.type && newTaskValues.type !== task?.type && !newTaskValues.config ?
                    // Set empty config
                    {} :
                    // Else use current config
                    newTaskValues.config,
        });
    };

    return (
        <Form
            initialValues={{
                campaign_id: parseInt(campId),
                config: { ...task?.config, fields: [] },
                deadline: task?.deadline,
                expires: task?.expires,
                instructions: task?.instructions,
                published: task?.published,
                title: task?.title,
                type: task?.type,
            }}
            onSubmit={ (values) => submit(values) }
            render={ ({ handleSubmit, submitting, valid, values }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    <TextField
                        disabled={ campId ? true : false }
                        fullWidth
                        id="campaign"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.campaign' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.CAMPAIGN_ID }
                        required
                        select>
                        { campaigns && campaigns.map(c => (
                            <MenuItem key={ c.id } value={ c.id }>
                                { c.title }
                            </MenuItem>
                        )) }
                    </TextField>

                    <TextField
                        fullWidth
                        id="title"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.title' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.TITLE }
                        required
                    />

                    <TextField
                        fullWidth
                        id="instructions"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.instructions' }) }
                        margin="normal"
                        multiline
                        name={ TASK_DETAILS_FIELDS.INSTRUCTIONS }
                        required
                        rows={ 2 }
                        variant="filled"

                    />

                    <TextField
                        fullWidth
                        id="task_type"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.type' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.TYPE }
                        required
                        select>
                        <MenuItem value={ TASK_TYPE.OFFLINE }>
                            <FormattedMessage id="misc.tasks.forms.createTask.fields.types.offline" />
                        </MenuItem>
                        <MenuItem value={ TASK_TYPE.SHARE_LINK }>
                            <FormattedMessage id="misc.tasks.forms.createTask.fields.types.share_link" />
                        </MenuItem>
                        <MenuItem value={ TASK_TYPE.VISIT_LINK }>
                            <FormattedMessage id="misc.tasks.forms.createTask.fields.types.visit_link" />
                        </MenuItem>
                        <MenuItem value={ TASK_TYPE.COLLECT_DEMOGRAPHICS }>
                            <FormattedMessage id="misc.tasks.forms.createTask.fields.types.demographic" />
                        </MenuItem>
                    </TextField>

                    { values.type === TASK_TYPE.COLLECT_DEMOGRAPHICS && (
                        <CollectDemographicsFields />
                    ) }

                    { /* Date Selectors */ }
                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        fullWidth={ true }
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.published' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.PUBLISHED }
                    />

                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        fullWidth={ true }
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.deadline' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.DEADLINE }
                    />

                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        fullWidth={ true }
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.expires' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.EXPIRES }
                    />

                    { /* Actions */ }
                    <Box display="flex" justifyContent="flex-end" mt={ 2 } width={ 1 }>
                        <Box m={ 1 }>
                            <Button color="primary" onClick={ onCancel }>
                                <Msg id="misc.formDialog.cancel" />
                            </Button>
                        </Box>
                        <Box m={ 1 }>
                            <Button color="primary" disabled={ submitting || !valid } type="submit" variant="contained">
                                <Msg id="misc.formDialog.submit" />
                            </Button>
                        </Box>
                    </Box>
                </form>
            ) }
            validate={ validate }
        />
    );
};

export default TaskDetailsForm;
