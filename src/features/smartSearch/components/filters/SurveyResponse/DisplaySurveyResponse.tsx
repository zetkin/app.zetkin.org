import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import { ELEMENT_TYPE } from 'utils/types/zetkin';
import getSurveysWithElements from 'features/smartSearch/fetching/getSurveysWithElements';
import {
  OPERATION,
  SmartSearchFilterWithId,
  SurveyResponseFilterConfig,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.surveyResponse;

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

  const questionElement = questionId
    ? surveys
        .find((s) => {
          return s.elements.find((e) => e.id === questionId);
        })
        ?.elements.find((e) => e.id === questionId)
    : undefined;

  const question =
    questionElement?.type == ELEMENT_TYPE.QUESTION
      ? questionElement.question.question
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
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        freeTextInput: value,
        matchSelect: <Msg id={localMessageIds.matchSelect[operator]} />,
        questionSelect: question ? (
          <Msg
            id={localMessageIds.questionSelect.question}
            values={{ question }}
          />
        ) : (
          <Msg id={localMessageIds.questionSelect.any} />
        ),
        surveySelect: (
          <Msg
            id={localMessageIds.surveySelect.survey}
            values={{ surveyTitle: surveyTitle || '' }}
          />
        ),
      }}
    />
  );
};

export default DisplaySurveyResponse;
