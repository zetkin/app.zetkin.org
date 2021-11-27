import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ChangeEventHandler, FunctionComponent, useEffect, useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';

import getSurveysWithElements from 'fetching/getSurveysWithElements';
import { SurveyResponseViewColumnConfig } from 'types/views';
import ZetkinQuery from 'components/ZetkinQuery';
import { ELEMENT_TYPE, RESPONSE_TYPE, ZetkinSurveyExtended } from 'types/zetkin';


interface SurveyResponseColumnConfigFormProps {
    config?: SurveyResponseViewColumnConfig;
    onChange: (config: SurveyResponseViewColumnConfig) => void;
}

function getSurveyFromQuestionId(surveys? : ZetkinSurveyExtended[], questionId? : number) {
    if (!surveys || !questionId) {
        return null;
    }

    return surveys.find(survey => survey.elements.some(elem => elem.id == questionId)) || null;
}

const SurveyResponseColumnConfigForm: FunctionComponent<SurveyResponseColumnConfigFormProps> = ({ config, onChange }) => {
    const { orgId } = useRouter().query;
    const surveysQuery = useQuery(['surveysWithElements', orgId], getSurveysWithElements(orgId as string));

    const [surveyId, setSurveyId] = useState<number | null>();

    useEffect(() => {
        if (!surveyId) {
            const selectedSurvey = getSurveyFromQuestionId(surveysQuery.data, config?.question_id);
            setSurveyId(selectedSurvey?.id || null);
        }
    }, [surveyId, config, surveysQuery.data]);

    const onSurveyChange : ChangeEventHandler<{ value: unknown }> = ev => {
        setSurveyId(ev.target.value as number);
        onChange({
            question_id: 0,
        });
    };

    const onQuestionChange : ChangeEventHandler<{ value: unknown }> = ev => {
        onChange({
            question_id: ev.target.value as number,
        });
    };

    return (
        <ZetkinQuery
            queries={{ surveysQuery }}>
            { ({ queries: { surveysQuery } }) => {
                const selectedSurvey = surveysQuery.data.find(survey => survey.id == surveyId);
                const questionElements = selectedSurvey?.elements
                    .filter(elem => elem.type == ELEMENT_TYPE.QUESTION)
                    .filter(elem => elem.question.response_type == RESPONSE_TYPE.TEXT) || null;

                return (
                    <>
                        <Select
                            onChange={ onSurveyChange }
                            value={ surveyId || '' }>
                            { surveysQuery.data.map(survey => (
                                <MenuItem key={ survey.id } value={ survey.id }>
                                    { survey.title }
                                </MenuItem>
                            )) }
                        </Select>
                        { questionElements && (
                            <Select
                                onChange={ onQuestionChange }
                                value={ config?.question_id || '' }>
                                { questionElements.map(elem => (
                                    <MenuItem key={ elem.id } value={ elem.id }>
                                        { elem.question.question }
                                    </MenuItem>
                                )) }
                            </Select>
                        ) }
                    </>
                );
            } }
        </ZetkinQuery>
    );
};

export default SurveyResponseColumnConfigForm;
