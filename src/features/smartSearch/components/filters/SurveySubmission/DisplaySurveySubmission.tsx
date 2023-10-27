import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  OPERATION,
  SmartSearchFilterWithId,
  SurveySubmissionFilterConfig,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import { useNumericRouteParams } from 'core/hooks';
import useSurvey from 'features/surveys/hooks/useSurvey';
const localMessageIds = messageIds.filters.surveySubmission;

interface DisplaySurveySubmissionProps {
  filter: SmartSearchFilterWithId<SurveySubmissionFilterConfig>;
}

const DisplaySurveySubmission = ({
  filter,
}: DisplaySurveySubmissionProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const { survey: surveyId } = config;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const surveyTitle = useSurvey(orgId, surveyId).data?.title ?? '';

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        surveySelect: (
          <Msg
            id={localMessageIds.surveySelect.survey}
            values={{
              surveyTitle: <UnderlinedText text={surveyTitle} />,
            }}
          />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplaySurveySubmission;
