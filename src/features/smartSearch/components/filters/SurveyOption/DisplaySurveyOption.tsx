import { DoneAll } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Chip, Tooltip } from '@mui/material';

import { getEllipsedString } from 'utils/stringUtils';
import getSurveysWithElements from 'features/smartSearch/fetching/getSurveysWithElements';
import { Msg } from 'core/i18n';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyOption,
} from 'utils/types/zetkin';
import {
  OPERATION,
  SmartSearchFilterWithId,
  SurveyOptionFilterConfig,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import StyledMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
const localMessageIds = messageIds.filters.surveyOption;

interface DisplaySurveyOptionProps {
  filter: SmartSearchFilterWithId<SurveyOptionFilterConfig>;
}

const DisplaySurveyOption = ({
  filter,
}: DisplaySurveyOptionProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const {
    operator,
    question: questionId,
    survey: surveyId,
    options: optionIds,
  } = config;
  const op = filter.op || OPERATION.ADD;

  const surveysQuery = useQuery(
    ['surveysWithElements', orgId],
    getSurveysWithElements(orgId as string)
  );

  const surveys = surveysQuery.data || [];

  const survey = surveys.find((s) => s.id === surveyId);
  const element = survey?.elements.find((e) => e.id == questionId);
  const question =
    element?.type == ELEMENT_TYPE.QUESTION ? element.question : null;

  const options =
    question && question.response_type == RESPONSE_TYPE.OPTIONS
      ? (optionIds.map((oId) =>
          question.options?.find((option) => option.id === oId)
        ) as ZetkinSurveyOption[])
      : [];

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <StyledMsg id={localMessageIds.addRemoveSelect[op]} />,
        conditionSelect: (
          <StyledMsg id={localMessageIds.conditionSelect[operator]} />
        ),
        options: (
          <Box display="inline">
            {options.map((o) => {
              const shortenedLabel = getEllipsedString(o.text, 15);
              return shortenedLabel.length === o.text.length ? (
                <Chip
                  icon={<DoneAll />}
                  label={o.text}
                  size="small"
                  style={{ margin: '2px' }}
                  variant="outlined"
                />
              ) : (
                <Tooltip key={o.id} title={o.text}>
                  <Chip
                    icon={<DoneAll />}
                    label={shortenedLabel}
                    size="small"
                    style={{ margin: '2px' }}
                    variant="outlined"
                  />
                </Tooltip>
              );
            })}
          </Box>
        ),
        questionSelect: question ? (
          <Msg
            id={localMessageIds.questionSelect.question}
            values={{
              question: <UnderlinedText text={question.question} />,
            }}
          />
        ) : (
          <Msg id={localMessageIds.questionSelect.any} />
        ),
        surveySelect: (
          <Msg
            id={localMessageIds.surveySelect.survey}
            values={{
              surveyTitle: <UnderlinedText text={survey?.title ?? ''} />,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplaySurveyOption;
