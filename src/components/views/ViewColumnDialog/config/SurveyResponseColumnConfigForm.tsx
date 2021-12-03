import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ChangeEventHandler, FunctionComponent, useEffect, useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';

import getSurveysWithElements from 'fetching/getSurveysWithElements';
import ZetkinQuery from 'components/ZetkinQuery';
import { ELEMENT_TYPE, RESPONSE_TYPE, ZetkinSurveyExtended } from 'types/zetkin';
import { PendingZetkinViewColumn, SurveyResponseViewColumn } from 'types/views';


interface SurveyResponseColumnConfigFormProps {
    column: SurveyResponseViewColumn | PendingZetkinViewColumn;
    onChange: (column: SurveyResponseViewColumn | PendingZetkinViewColumn) => void;
}

function getSurveyFromQuestionId(surveys? : ZetkinSurveyExtended[], questionId? : number) {
    if (!surveys || !questionId) {
        return null;
    }

    return surveys.find(survey => survey.elements.some(elem => elem.id == questionId)) || null;
}

const SurveyResponseColumnConfigForm: FunctionComponent<SurveyResponseColumnConfigFormProps> = ({ column, onChange }) => {
    const { orgId } = useRouter().query;
    const surveysQuery = useQuery(['surveysWithElements', orgId], getSurveysWithElements(orgId as string));

    const [surveyId, setSurveyId] = useState<number | null>();

    useEffect(() => {
        if (!surveyId) {
            const selectedSurvey = getSurveyFromQuestionId(surveysQuery.data, (column.config as SurveyResponseViewColumn['config'])?.question_id);
            setSurveyId(selectedSurvey?.id || null);
        }
    }, [surveyId, column.config, surveysQuery.data]);

    const onSurveyChange : ChangeEventHandler<{ value: unknown }> = ev => {
        setSurveyId(ev.target.value as number);
    };

    return (
        <ZetkinQuery
            queries={{ surveysQuery }}>
            { ({ queries: { surveysQuery } }) => {
                const selectedSurvey = surveysQuery.data.find(survey => survey.id == surveyId);
                const questionElements = selectedSurvey?.elements
                    .filter(elem => elem.type == ELEMENT_TYPE.QUESTION)
                    .filter(elem => elem.question.response_type == RESPONSE_TYPE.TEXT) || null;

                const onQuestionChange : ChangeEventHandler<{ value: unknown }> = ev => {
                    const selectedQuestion = selectedSurvey?.elements.find(element => element.id === ev.target.value as number )?.question;
                    onChange({
                        ...column,
                        config: {
                            question_id: ev.target.value as number,
                        },
                        title: selectedQuestion?.question || '',
                    });
                };

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
                                value={ (column.config as SurveyResponseViewColumn['config'])?.question_id || '' }>
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
