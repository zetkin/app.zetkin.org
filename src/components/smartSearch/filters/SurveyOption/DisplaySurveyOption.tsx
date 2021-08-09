import { DoneAll } from '@material-ui/icons';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Chip, Tooltip } from '@material-ui/core';

import getSurveysWithElements from 'fetching/getSurveysWithElements';
import { ZetkinSurveyOption } from 'types/zetkin';
import { OPERATION, SmartSearchFilterWithId, SurveyOptionFilterConfig } from 'types/smartSearch';

interface DisplaySurveyOptionProps {
    filter: SmartSearchFilterWithId<SurveyOptionFilterConfig>;
}

const DisplaySurveyOption = ({ filter }: DisplaySurveyOptionProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const { config } = filter;
    const { operator, question: questionId, survey: surveyId, options: optionIds  } = config;
    const op = filter.op || OPERATION.ADD;

    const surveysQuery = useQuery(['surveysWithElements', orgId], getSurveysWithElements(orgId as string));

    const surveys = surveysQuery.data || [];

    const survey = surveys.find(s => s.id === surveyId);
    const question = survey?.elements.find(e => e.id === questionId)?.question;

    const options = question ? optionIds
        .map(oId => question.options?.find(option => option.id === oId)) as ZetkinSurveyOption[] : [];


    return (
        <Msg
            id="misc.smartSearch.survey_option.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.survey_option.addRemoveSelect.${op}` }/>
                ),
                conditionSelect: <Msg id={ `misc.smartSearch.survey_option.conditionSelect.${operator}` }/>,
                options: (
                    <Box alignItems="start" display="inline-flex">
                        { options.map(o => (
                            <Tooltip
                                key={ o.id }
                                title={ o.text }>
                                <Chip
                                    icon={ <DoneAll/> }
                                    label={ o.text }
                                    size="small"
                                    style={{ margin: '2px',
                                        maxWidth: '10rem' }}
                                    variant="outlined"
                                />
                            </Tooltip>
                        )) }
                    </Box>),
                questionSelect: question ? <Msg
                    id="misc.smartSearch.survey_option.questionSelect.question"
                    values={{ question: question.question }}
                /> : <Msg
                    id="misc.smartSearch.survey_option.questionSelect.any"
                />,
                surveySelect: <Msg
                    id="misc.smartSearch.survey_option.surveySelect.survey"
                    values={{ surveyTitle: survey?.title }}
                />,
            }}
        />
    );
};

export default DisplaySurveyOption;
