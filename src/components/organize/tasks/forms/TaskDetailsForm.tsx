import { Form } from 'react-final-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, MenuItem } from '@material-ui/core';
import { DateTimePicker, TextField } from 'mui-rff';
import { FormattedMessage, FormattedMessage as Msg, useIntl } from 'react-intl';

import getCampaigns from 'fetching/getCampaigns';
import { ZetkinTask, ZetkinTaskReqBody, ZetkinTaskType } from 'types/zetkin';

import { TASK_DETAILS_FIELDS } from './constants';

interface TaskDetailsFormProps {
    onSubmit: (data: ZetkinTaskReqBody) => void;
    onCancel: () => void;
    task?: ZetkinTask;
}

const TaskDetailsForm = ({ onSubmit, onCancel, task }: TaskDetailsFormProps): JSX.Element => {
    const router = useRouter();
    const { campId, orgId } = router.query as {campId: string; orgId: string};
    const intl = useIntl();
    const { data: campaigns } = useQuery(['campaigns', orgId], getCampaigns(orgId));

    const validate = (values: ZetkinTaskReqBody) => {
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
        return errors;
    };

    return (
        <Form
            initialValues={{
                campaign_id: parseInt(campId),
                deadline: task?.deadline,
                expires: task?.expires,
                instructions: task?.instructions,
                published: task?.published,
                title: task?.title,
                type: task?.type,
            }}
            onSubmit={ (values) => onSubmit(values) }
            render={ ({ handleSubmit, submitting }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    { /* Fields */ }
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
                        id="task_type"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.type' }) }
                        margin="normal"
                        name={ TASK_DETAILS_FIELDS.TYPE }
                        required
                        select>
                        <MenuItem value={ ZetkinTaskType.offline }>
                            <FormattedMessage id="misc.tasks.forms.createTask.fields.types.offline" />
                        </MenuItem>
                        <MenuItem value={ ZetkinTaskType.share_link }>
                            <FormattedMessage id="misc.tasks.forms.createTask.fields.types.share_link" />
                        </MenuItem>
                        <MenuItem value={ ZetkinTaskType.visit_link }>
                            <FormattedMessage id="misc.tasks.forms.createTask.fields.types.open_link" />
                        </MenuItem>
                    </TextField>

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
                        id="instructions"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.instructions' }) }
                        margin="normal"
                        multiline
                        name={ TASK_DETAILS_FIELDS.INSTRUCTIONS }
                        required
                        rows={ 2 }
                        variant="filled"

                    />

                    { /* Date Selectors */ }
                    <Box mt={ 2 }>
                        <DateTimePicker
                            ampm={ false }
                            fullWidth={ true }
                            label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.published' }) }
                            name={ TASK_DETAILS_FIELDS.PUBLISHED }
                        />
                    </Box>
                    <Box mt={ 2 }>
                        <DateTimePicker
                            ampm={ false }
                            fullWidth={ true }
                            label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.deadline' }) }
                            name={ TASK_DETAILS_FIELDS.DEADLINE }
                        />
                    </Box>
                    <Box mt={ 2 }>
                        <DateTimePicker
                            ampm={ false }
                            fullWidth={ true }
                            label={ intl.formatMessage({ id: 'misc.tasks.forms.createTask.fields.expires' }) }
                            name={ TASK_DETAILS_FIELDS.EXPIRES }
                        />
                    </Box>

                    { /* Actions */ }
                    <Box display="flex" justifyContent="flex-end" mt={ 2 } width={ 1 }>
                        <Box m={ 1 }>
                            <Button color="primary" onClick={ onCancel }>
                                <Msg id="misc.formDialog.cancel" />
                            </Button>
                        </Box>
                        <Box m={ 1 }>
                            <Button color="primary" disabled={ submitting } type="submit" variant="contained">
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
