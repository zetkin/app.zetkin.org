import { FC } from 'react';
import { AssignmentOutlined, ChatBubbleOutline } from '@mui/icons-material';

import useModel from 'core/useModel';
import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import SurveyDataModel, {
  SurveyState,
} from 'features/surveys/models/SurveyDataModel';

interface SurveyListItemProps {
  orgId: number;
  surveyId: number;
}

const SurveyListItem: FC<SurveyListItemProps> = ({ orgId, surveyId }) => {
  const dataModel = useModel(
    (env) => new SurveyDataModel(env, orgId, surveyId)
  );
  const data = dataModel.getData().data;
  const stats = dataModel.getStats().data;

  if (!data) {
    return null;
  }

  let hasExpired = false;
  if (data.expires) {
    const expires = new Date(data.expires);
    const now = new Date();

    if (expires < now) {
      hasExpired = true;
    }
  }

  const state = dataModel.state;
  let color = STATUS_COLORS.GRAY;
  if (state === SurveyState.PUBLISHED) {
    color = STATUS_COLORS.GREEN;
  } else if (state === SurveyState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (hasExpired) {
    color = STATUS_COLORS.RED;
  }

  const submissionCount = stats?.submissionCount || 0;
  const unlinkedSubmissionCount = stats?.unlinkedSubmissionCount || 0;
  const linkedSubmissionCount = submissionCount - unlinkedSubmissionCount || 0;

  return (
    <ActivityListItem
      color={color}
      endNumber={submissionCount.toString()}
      greenChipValue={linkedSubmissionCount}
      href={`/organize/${orgId}/campaigns/${
        data.campaign?.id ?? 'standalone'
      }/surveys/${surveyId}`}
      orangeChipValue={unlinkedSubmissionCount}
      PrimaryIcon={AssignmentOutlined}
      SecondaryIcon={ChatBubbleOutline}
      title={data.title}
    />
  );
};

export default SurveyListItem;
