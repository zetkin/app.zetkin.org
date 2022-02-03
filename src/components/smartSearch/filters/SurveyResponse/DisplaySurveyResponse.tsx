import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getSurveysWithElements from 'fetching/getSurveysWithElements';
import {
  OPERATION,
  SmartSearchFilterWithId,
  SurveyResponseFilterConfig,
} from 'types/smartSearch';

interface DisplaySurveyResponseProps {
  filter: SmartSearchFilterWithId<SurveyResponseFilterConfig>;
}

const DisplaySurveyResponse = ({
  filter,
}: DisplaySurveyResponseProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const { operator, value } = config;
  const questionId = 'question' in config ? config.question : undefined;
  const surveyId = 'survey' in config ? config.survey : undefined;
  const op = filter.op || OPERATION.ADD;

  const surveysQuery = useQuery(
    ['surveysWithElements', orgId],
    getSurveysWithElements(orgId as string)
  );

  const surveys = surveysQuery.data || [];

  const question = questionId
    ? surveys
        .find((s) => {
          return s.elements.find((e) => e.id === questionId);
        })
        ?.elements.find((e) => e.id === questionId)?.question.question
    : undefined;

  // get survey title from questionId if surveyId is undefined
  const surveyTitle = surveyId
    ? surveys.find((s) => {
        return s.id === surveyId;
      })?.title
    : surveys.find((s) => {
        return s.elements.some((e) => e.id === questionId);
      })?.title;

  return (
    <Msg
      id="misc.smartSearch.survey_response.inputString"
      values={{
        addRemoveSelect: (
          <Msg id={`misc.smartSearch.survey_response.addRemoveSelect.${op}`} />
        ),
        freeTextInput: value,
        matchSelect: (
          <Msg
            id={`misc.smartSearch.survey_response.matchSelect.${operator}`}
          />
        ),
        questionSelect: question ? (
          <Msg
            id="misc.smartSearch.survey_response.questionSelect.question"
            values={{ question }}
          />
        ) : (
          <Msg id="misc.smartSearch.survey_response.questionSelect.any" />
        ),
        surveySelect: (
          <Msg
            id="misc.smartSearch.survey_response.surveySelect.survey"
            values={{ surveyTitle }}
          />
        ),
      }}
    />
  );
};

export default DisplaySurveyResponse;
