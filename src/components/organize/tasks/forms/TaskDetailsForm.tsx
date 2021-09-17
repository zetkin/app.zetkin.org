import { Form } from 'react-final-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import validator from 'validator';
import { Box, Button, MenuItem } from '@material-ui/core';
import { DateTimePicker, TextField } from 'mui-rff';
import { FormattedMessage, FormattedMessage as Msg, useIntl } from 'react-intl';

import getCampaigns from 'fetching/getCampaigns';
import { ZetkinTask } from 'types/zetkin';
import { AnyTaskTypeConfig, TASK_TYPE, VisitLinkConfig, ZetkinTaskRequestBody } from 'types/tasks';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

import CollectDemographicsFields from './fields/CollectDemographicsFields';
import ShareLinkFields from './fields/ShareLinkFields';
import TimeEstimateField from './fields/TimeEstimateField';
import VisitLinkFields from './fields/VisitLinkFields';

import { configForTaskType, isDeadlineSecond, isExpiresThird, isPublishedFirst } from './utils';
import { DEFAULT_TIME_ESTIMATE, TASK_DETAILS_FIELDS } from './constants';


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
    const taskStatus = task ? getTaskStatus(task) : null;

    const validate = (values: ZetkinTaskRequestBody) => {
        const errors: Record<string, string | Record<string, string>> = {};
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
        if (values.type === TASK_TYPE.VISIT_LINK || values.type === TASK_TYPE.SHARE_LINK) {
            const config = values.config as VisitLinkConfig;
            if (config?.url) {
                const valid = validator.isURL(config.url);
                if (!valid) {
                    errors.config = {
                        url: intl.formatMessage({ id: 'misc.formDialog.invalidUrl' }),
                    };
                }
            }
            else {
                errors.config = {
                    url: intl.formatMessage({ id: 'misc.formDialog.required' }),
                };
            }
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
        // Change shape of fields to array
        const configWithFieldsArray = {
            ...newTaskValues.config,
            ...(newTaskValues?.config && 'fields' in newTaskValues?.config && newTaskValues?.config.fields && { fields: [newTaskValues?.config?.fields] }),
        };
        const config = configForTaskType(newTaskValues.type, configWithFieldsArray as AnyTaskTypeConfig);

        // If time estimate is 'No estimate', set to null
        const time_estimate = newTaskValues.time_estimate as number | string === DEFAULT_TIME_ESTIMATE ? null : newTaskValues.time_estimate;

        onSubmit({
            ...newTaskValues,
            config,
            time_estimate,
        });
    };

    return (
        <Form
            initialValues={{
                campaign_id: parseInt(campId),
                config: {
                    ...task?.config,
                    // Set first value from fields array
                    ...(task?.config && 'fields' in task?.config && task?.config.fields && { fields: task?.config?.fields[0] }),
                },
                deadline: task?.deadline,
                expires: task?.expires,
                instructions: task?.instructions,
                published: task?.published,
                time_estimate: task?.time_estimate || DEFAULT_TIME_ESTIMATE,
                title: task?.title,
                type: task?.type,
            }}
            keepDirtyOnReinitialize
            onSubmit={ submit }
            render={ ({ handleSubmit, submitting, valid, values }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    { /* Required fields */ }
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

                    <TimeEstimateField />

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

                    { /* Custom fields for task type config */ }
                    { values.type === TASK_TYPE.COLLECT_DEMOGRAPHICS && (
                        <CollectDemographicsFields />
                    ) }
                    { values.type === TASK_TYPE.SHARE_LINK && (
                        <ShareLinkFields />
                    ) }
                    { values.type === TASK_TYPE.VISIT_LINK && (
                        <VisitLinkFields />
                    ) }

                    { /* Date Selectors */ }
                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        disabled={ taskStatus === TASK_STATUS.ACTIVE || taskStatus === TASK_STATUS.CLOSED }
                        disablePast
                        fullWidth={ true }
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.published' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.PUBLISHED }
                    />

                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        disablePast
                        fullWidth={ true }
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.deadline' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.DEADLINE }
                    />

                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        disablePast
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
