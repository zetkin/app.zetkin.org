import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ChangeEventHandler, FunctionComponent } from 'react';
import { MenuItem, Select } from '@material-ui/core';

import getSurveys from 'fetching/getSurveys';
import { SurveySubmittedViewColumnConfig } from 'types/views';
import ZetkinQuery from 'components/ZetkinQuery';


interface SurveySubmittedColumnConfigFormProps {
    config?: SurveySubmittedViewColumnConfig;
    onChange: (config: SurveySubmittedViewColumnConfig) => void;
}

const SurveySubmittedColumnConfigForm: FunctionComponent<SurveySubmittedColumnConfigFormProps> = ({ config, onChange }) => {
    const { orgId } = useRouter().query;

    const onSurveyChange : ChangeEventHandler<{ value: unknown }> = ev => {
        onChange({
            survey_id: ev.target.value as number,
        });
    };

    return (
        <ZetkinQuery
            queries={{
                surveysQuery: useQuery(['surveys', orgId], getSurveys(orgId as string)),
            }}>
            { ({ queries: { surveysQuery } }) => (
                <Select
                    onChange={ onSurveyChange }
                    value={ config?.survey_id || '' }>
                    { surveysQuery.data.map(survey => (
                        <MenuItem key={ survey.id } value={ survey.id }>
                            { survey.title }
                        </MenuItem>
                    )) }
                </Select>
            ) }
        </ZetkinQuery>
    );
};

export default SurveySubmittedColumnConfigForm;
