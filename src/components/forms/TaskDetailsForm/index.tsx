import { Form } from 'react-final-form';
import { MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import validator from 'validator';
import { DateTimePicker, TextField } from 'mui-rff';
import { FormattedMessage, useIntl } from 'react-intl';

import getCampaigns from 'fetching/getCampaigns';
import { ZetkinTask } from 'types/zetkin';
import { AnyTaskTypeConfig, TASK_TYPE, VisitLinkConfig, ZetkinTaskRequestBody } from 'types/tasks';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

import CollectDemographicsFields from './fields/CollectDemographicsFields';
import ShareLinkFields from './fields/ShareLinkFields';
import TimeEstimateField from './fields/TimeEstimateField';
import VisitLinkFields from './fields/VisitLinkFields';

import SubmitCancelButtons from '../common/SubmitCancelButtons';
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
            errors.config = {};
            if (!config?.url) {
                errors.config.url = intl.formatMessage({ id: 'misc.formDialog.required' });
            }
            else if (!validator.isURL(config.url, { require_protocol: true })) {
                errors.config.url =  intl.formatMessage({ id: 'misc.formDialog.invalidUrl' });
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
                        id={ TASK_DETAILS_FIELDS.CAMPAIGN_ID }
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
                        id={ TASK_DETAILS_FIELDS.INSTRUCTIONS }
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
                        id={ TASK_DETAILS_FIELDS.TYPE }
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
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.published' }) }
                        name={ TASK_DETAILS_FIELDS.PUBLISHED }
                    />

                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        disablePast
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.deadline' }) }
                        name={ TASK_DETAILS_FIELDS.DEADLINE }
                    />

                    <DateTimePicker
                        ampm={ false }
                        clearable={ true }
                        disablePast
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.expires' }) }
                        name={ TASK_DETAILS_FIELDS.EXPIRES }
                    />

                    <SubmitCancelButtons onCancel={ onCancel } submitDisabled={ submitting || !valid } />
                </form>
            ) }
            validate={ validate }
        />
    );
};

export default TaskDetailsForm;
