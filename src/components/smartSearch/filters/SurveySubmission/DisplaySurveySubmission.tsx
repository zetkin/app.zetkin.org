import { FormattedMessage as Msg } from 'react-intl';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getSurvey from 'fetching/getSurvey';
import { getTimeFrameWithConfig } from '../../utils';
import { OPERATION, SmartSearchFilterWithId, SurveySubmissionFilterConfig } from 'types/smartSearch';

interface DisplaySurveySubmissionProps {
    filter: SmartSearchFilterWithId<SurveySubmissionFilterConfig>;
    onBreak: () => void;
}

const DisplaySurveySubmission = ({ filter, onBreak }: DisplaySurveySubmissionProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const { config } = filter;
    const { survey: surveyId } = config;
    const op = filter.op || OPERATION.ADD;
    const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({ after: config.after, before: config.before });

    const surveyQuery = useQuery(['survey', orgId, surveyId], getSurvey(orgId as string, surveyId.toString()));
    const surveyTitle = surveyQuery?.data?.title;

    useEffect(() => {
        if (!surveyTitle) {
            onBreak();
        }
    }, [surveyTitle]); // eslint-disable-line react-hooks/exhaustive-deps

    return surveyTitle ? (
        <Msg
            id="misc.smartSearch.survey_submission.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.survey_submission.addRemoveSelect.${op}` }/>
                ),
                surveySelect: <Msg
                    id="misc.smartSearch.survey_submission.surveySelect.survey"
                    values={{ surveyTitle }}
                />,
                timeFrame: (
                    <Msg
                        id={ `misc.smartSearch.timeFrame.preview.${timeFrame}` }
                        values={{
                            afterDate: (
                                after?.toISOString().slice(0,10)
                            ),
                            beforeDate: (
                                before?.toISOString().slice(0, 10)
                            ),
                            days: numDays,
                        }}
                    />
                ) }}
        />
    ) : <Msg id="misc.smartSearch.survey_submission.broken" />;
};

export default DisplaySurveySubmission;
