import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';

import { getTimeFrameWithConfig } from '../../utils';
import { useGetSurvey } from 'fetching/getSurvey';
import { OPERATION, SmartSearchFilterWithId, SurveySubmissionFilterConfig } from 'types/smartSearch';

interface DisplaySurveySubmissionProps {
    filter: SmartSearchFilterWithId<SurveySubmissionFilterConfig>;
}

const DisplaySurveySubmission = ({ filter }: DisplaySurveySubmissionProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const { config } = filter;
    const { survey: surveyId } = config;
    const op = filter.op || OPERATION.ADD;
    const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({ after: config.after, before: config.before });

    const surveyQuery = useGetSurvey(orgId as string, surveyId.toString());
    const surveyTitle = surveyQuery?.data?.title;

    return (
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
    );
};

export default DisplaySurveySubmission;
