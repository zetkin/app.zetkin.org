import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { Box, Button, MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { CollectDemographicsConfig, DEMOGRAPHICS_FIELD } from 'types/tasks';

import { COLLECT_DEMOGRAPHICS_FIELDS } from './constants';

interface CollectDemographicsFormValues  {
    field: DEMOGRAPHICS_FIELD;
}

interface CollectDemographicsConfigFormProps {
    onSubmit: (config: CollectDemographicsConfig) => void;
    onCancel: () => void;
    taskConfig: Partial<CollectDemographicsConfig>;
}

const CollectDemographicsConfigForm: React.FunctionComponent<CollectDemographicsConfigFormProps> = ({ onSubmit, onCancel, taskConfig }): JSX.Element => {
    const intl = useIntl();

    const validate = (values: CollectDemographicsFormValues) => {
        const errors: Record<string, string> = {};
        if (!values.field) {
            errors.url = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        return errors;
    };

    const handleSubmitWithFieldArray = (values: CollectDemographicsFormValues) => {
        const configWithFieldArray = {
            fields: [values.field],
        };
        onSubmit(configWithFieldArray);
    };

    return (
        <Form
            initialValues={{
                field: taskConfig?.fields && taskConfig.fields[0] || DEMOGRAPHICS_FIELD.EMAIL,
            }}
            onSubmit={ (values) => handleSubmitWithFieldArray(values) }
            render={ ({ handleSubmit, submitting }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    <TextField
                        fullWidth
                        id="task_type"
                        label={ intl.formatMessage({ id: 'misc.tasks.forms.collectDemographicsConfig.fields.demographicField' }) }
                        margin="normal"
                        name={ COLLECT_DEMOGRAPHICS_FIELDS.FIELD }
                        required
                        select>
                        { Object.values(DEMOGRAPHICS_FIELD).map(field => {
                            return (
                                <MenuItem key={ field } value={ field }>
                                    <Msg id={ `misc.tasks.forms.collectDemographicsConfig.fields.demographicFieldOptions.${field}` } />
                                </MenuItem>
                            );
                        }) }
                    </TextField>

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

export default CollectDemographicsConfigForm;
