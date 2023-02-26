import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getSurvey from 'features/smartSearch/fetching/getSurvey';
import { getTimeFrameWithConfig } from '../../utils';
import {
  OPERATION,
  SmartSearchFilterWithId,
  SurveySubmissionFilterConfig,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
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
  const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({
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
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        surveySelect: (
          <Msg
            id={localMessageIds.surveySelect.survey}
            values={{ surveyTitle }}
          />
        ),
        timeFrame: (
          <Msg
            id={messageIds.timeFrame.preview[timeFrame]}
            values={{
              afterDate: after?.toISOString().slice(0, 10),
              beforeDate: before?.toISOString().slice(0, 10),
              days: numDays,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplaySurveySubmission;
