import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { Box, Button } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { VisitLinkConfig } from 'types/tasks';

import { VISIT_LINK_FIELDS } from './constants';

interface VisitLinkConfigFormProps {
    onSubmit: (config: VisitLinkConfig) => void;
    onCancel: () => void;
    taskConfig: VisitLinkConfig;
}

const VisitLinkConfigForm = ({ onSubmit, onCancel, taskConfig }: VisitLinkConfigFormProps): JSX.Element => {
    const intl = useIntl();

    const validate = (values: VisitLinkConfig) => {
        const errors: Record<string, string> = {};
        if (!values.url) {
            errors.url = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        return errors;
    };

    return (
        <Form
            initialValues={{
                url: taskConfig?.url,
            }}
            onSubmit={ (values) => onSubmit(values) }
            render={ ({ handleSubmit, submitting }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    <TextField
                        fullWidth
                        id="url"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.visitLinkConfig.fields.url' }) }
                        margin="normal"
                        name={ VISIT_LINK_FIELDS.URL }
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

export default VisitLinkConfigForm;
