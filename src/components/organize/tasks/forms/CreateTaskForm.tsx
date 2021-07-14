// import dayjs from 'dayjs';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import getCampaigns from '../../../../fetching/getCampaigns';
import { ZetkinTaskReqBody, ZetkinTaskType } from '../../../../types/zetkin';

interface CreateTaskFormProps {
    onSubmit: (data: ZetkinTaskReqBody) => void;
    onCancel: () => void;
}

const CreateTaskForm = ({ onSubmit, onCancel }: CreateTaskFormProps): JSX.Element => {
    const router = useRouter();
    const { campId, orgId } = router.query as {campId: string; orgId: string};
    const intl = useIntl();
    const { data: campaigns } = useQuery(['campaigns', orgId], getCampaigns(orgId));

    // const formattedNow = dayjs().format('YYYY-MM-DDThh:mm');

    const initialValues = {
        campaign_id: parseInt(campId),
    };

    const validate = (values: ZetkinTaskReqBody) => {
        const errors: Record<string, string> = {};

        if (!values.title) {
            errors.title = intl.formatMessage({ id: 'misc.formDialog.required' });
        }

        return errors;
    };

    return (
        <Form
            initialValues={ initialValues }
            onSubmit={ (values) => onSubmit(values) }
            render={ ({ handleSubmit, submitting }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    { /* Fields */ }
                    <TextField
                        fullWidth
                        id="title"
                        label="Title"
                        margin="normal"
                        name="title"
                    />

                    <TextField
                        fullWidth
                        id="task_type"
                        label="Task Type"
                        margin="normal"
                        name="type"
                        select>
                        <MenuItem value={ ZetkinTaskType.offline }>
                            { ZetkinTaskType.offline }
                        </MenuItem>
                        <MenuItem value={ ZetkinTaskType.share_link }>
                            { ZetkinTaskType.share_link }
                        </MenuItem>
                        <MenuItem value={ ZetkinTaskType.visit_link }>
                            { ZetkinTaskType.visit_link }
                        </MenuItem>
                    </TextField>

                    <TextField
                        disabled={ campId ? true : false }
                        fullWidth
                        id="campaign"
                        label="Campaign"
                        margin="normal"
                        name="campaign_id"
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
                        label="Instructions"
                        margin="normal"
                        multiline
                        name="instructions"
                        rows={ 2 }
                        variant="filled"
                    />


                    { /* Actions */ }
                    <Box display="flex" justifyContent="flex-end" width={ 1 }>
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

export default CreateTaskForm;
