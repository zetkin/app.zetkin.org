import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { ChangeEventHandler, FunctionComponent } from 'react';
import { MenuItem, TextField } from '@material-ui/core';

import { SurveySubmittedViewColumn } from 'types/views';
import { useGetSurveys } from 'fetching/getSurveys';
import ZetkinQuery from 'components/ZetkinQuery';


interface SurveySubmittedColumnConfigFormProps {
    column: SurveySubmittedViewColumn;
    onChange: (config: SurveySubmittedViewColumn) => void;
}

const SurveySubmittedColumnConfigForm: FunctionComponent<SurveySubmittedColumnConfigFormProps> = ({ column, onChange }) => {
    const intl = useIntl();
    const { orgId } = useRouter().query;

    return (
        <ZetkinQuery
            queries={{
                surveysQuery: useGetSurveys(orgId as string),
            }}>
            { ({ queries: { surveysQuery } }) => {

                const onSurveyChange : ChangeEventHandler<{ value: unknown }> = ev => {
                    onChange({
                        ...column,
                        config: {
                            survey_id: ev.target.value as number,
                        },
                        title: surveysQuery.data.find(survey => survey.id === ev.target.value)?.title || '',
                    });
                };

                return (
                    <TextField
                        fullWidth
                        label={ intl.formatMessage({ id: 'misc.views.columnDialog.editor.fieldLabels.survey' }) }
                        margin="normal"
                        onChange={ onSurveyChange }
                        select
                        value={ column.config?.survey_id || '' }>
                        { surveysQuery.data.map(survey => (
                            <MenuItem key={ survey.id } value={ survey.id }>
                                { survey.title }
                            </MenuItem>
                        )) }
                    </TextField>
                );
            } }
        </ZetkinQuery>
    );
};

export default SurveySubmittedColumnConfigForm;
