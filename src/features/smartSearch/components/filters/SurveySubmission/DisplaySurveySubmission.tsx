import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import DisplayTimeFrame from '../DisplayTimeFrame';
import getSurvey from 'features/smartSearch/fetching/getSurvey';
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
const localMessageIds = messageIds.filters.surveySubmission;

interface DisplaySurveySubmissionProps {
  filter: SmartSearchFilterWithId<SurveySubmissionFilterConfig>;
}

const DisplaySurveySubmission = ({
  filter,
}: DisplaySurveySubmissionProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const { survey: surveyId } = config;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const surveyQuery = useQuery(
    ['survey', orgId, surveyId],
    getSurvey(orgId as string, surveyId.toString())
  );
  const surveyTitle = surveyQuery?.data?.title ?? '';

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: (
          <UnderlinedMsg id={messageIds.addLimitRemoveSelect[op]} />
        ),
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
