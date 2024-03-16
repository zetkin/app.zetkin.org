import { DoneAll } from '@mui/icons-material';
import { Box, Chip, Tooltip } from '@mui/material';

import { getEllipsedString } from 'utils/stringUtils';
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
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import { useNumericRouteParams } from 'core/hooks';
import useSurvey from 'features/surveys/hooks/useSurvey';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
const localMessageIds = messageIds.filters.surveyOption;

interface DisplaySurveyOptionProps {
  filter: SmartSearchFilterWithId<SurveyOptionFilterConfig>;
}

const DisplaySurveyOption = ({
  filter,
}: DisplaySurveyOptionProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const {
    operator,
    question: questionId,
    survey: surveyId,
    options: optionIds,
  } = config;
  const op = filter.op || OPERATION.ADD;

  const surveyTitle = useSurvey(orgId, surveyId).data?.title || '';
  const surveyElements = useSurveyElements(orgId, surveyId).data || [];

  const element = surveyElements?.find((e) => e.id == questionId);
  const question =
    element?.type == ELEMENT_TYPE.QUESTION ? element.question : null;

  const options =
    question && question.response_type == RESPONSE_TYPE.OPTIONS
      ? (optionIds.map((oId) => {
          return question.options?.find((option) => option.id == oId);
        }) as ZetkinSurveyOption[])
      : [];

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        conditionSelect: (
          <UnderlinedMsg id={localMessageIds.conditionSelect[operator]} />
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
              surveyTitle: <UnderlinedText text={surveyTitle} />,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplaySurveyOption;
