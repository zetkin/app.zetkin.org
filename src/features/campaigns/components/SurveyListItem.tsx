import { FC } from 'react';
import { AssignmentOutlined, ChatBubbleOutline } from '@mui/icons-material';

import SurveySubmissionsModel from 'features/surveys/models/SurveySubmissionsModel';
import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import SurveyDataModel, {
  SurveyState,
} from 'features/surveys/models/SurveyDataModel';

interface SurveyListItemProps {
  dataModel: SurveyDataModel;
  submissionsModel: SurveySubmissionsModel;
}

const SurveyListItem: FC<SurveyListItemProps> = ({
  dataModel,
  submissionsModel,
}) => {
  const data = dataModel.getData().data;
  const stats = dataModel.getStats().data;
  const submissions = submissionsModel.getSubmissions().data;

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

  const endNumber = stats?.submissionCount.toString() || '';
  const greenChipValue =
    submissions?.filter((sub) => sub.respondent).length || 0;
  const orangeChipValue =
    submissions?.filter((sub) => !sub.respondent).length || 0;

  return (
    <ActivityListItem
      color={color}
      endNumber={endNumber}
      greenChipValue={greenChipValue}
      orangeChipValue={orangeChipValue}
      PrimaryIcon={AssignmentOutlined}
      SecondaryIcon={ChatBubbleOutline}
      title={data.title}
    />
  );
};

export default SurveyListItem;
