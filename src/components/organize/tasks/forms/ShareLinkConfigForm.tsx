import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { Box, Button } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { ShareLinkConfig } from 'types/tasks';

import { SHARE_LINK_FIELDS } from './constants';

interface ShareLinkConfigFormProps {
    onSubmit: (config: ShareLinkConfig) => void;
    onCancel: () => void;
    taskConfig: ShareLinkConfig;
}

const ShareLinkConfigForm = ({ onSubmit, onCancel, taskConfig }: ShareLinkConfigFormProps): JSX.Element => {
    const intl = useIntl();

    const validate = (values: ShareLinkConfig) => {
        const errors: Record<string, string> = {};
        if (!values.url) {
            errors.url = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        if (!values.default_message) {
            errors.url = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        return errors;
    };

    return (
        <Form
            initialValues={{
                default_message: taskConfig?.default_message,
                url: taskConfig?.url,
            }}
            onSubmit={ (values) => onSubmit(values) }
            render={ ({ handleSubmit, submitting }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    <TextField
                        fullWidth
                        id="url"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.shareLinkConfig.fields.url' }) }
                        margin="normal"
                        name={ SHARE_LINK_FIELDS.URL }
                        required
                    />

                    <TextField
                        fullWidth
                        id="url"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.shareLinkConfig.fields.default_message' }) }
                        margin="normal"
                        name={ SHARE_LINK_FIELDS.DEFAULT_MESSAGE }
                        required
                    />

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

export default ShareLinkConfigForm;
