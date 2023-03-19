import { FC } from 'react';
import { AssignmentOutlined, ChatBubbleOutline } from '@mui/icons-material';

import { SurveyActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import useModel from 'core/useModel';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';
import SurveyDataModel, {
  SurveyState,
} from 'features/surveys/models/SurveyDataModel';

interface SurveyOverviewListItemProps {
  activity: SurveyActivity;
  focusDate: Date | null;
}

const SurveyOverviewListItem: FC<SurveyOverviewListItemProps> = ({
  activity,
  focusDate,
}) => {
  const survey = activity.data;
  const dataModel = useModel(
    (env) => new SurveyDataModel(env, survey.organization.id, survey.id)
  );
  const data = dataModel.getData().data;
  const stats = dataModel.getStats().data;

  if (!data) {
    return null;
  }

  const state = dataModel.state;
  let color = STATUS_COLORS.GRAY;
  if (state === SurveyState.PUBLISHED) {
    color = STATUS_COLORS.GREEN;
  } else if (state === SurveyState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (SurveyState.UNPUBLISHED) {
    color = STATUS_COLORS.RED;
  }

  const submissionCount = stats?.submissionCount || 0;

  return (
    <OverviewListItem
      activity={activity}
      color={color}
      endNumber={submissionCount.toString()}
      focusDate={focusDate}
      href={`/organize/${survey.organization.id}/projects/${
        data.campaign?.id ?? 'standalone'
      }/surveys/${survey.id}`}
      PrimaryIcon={AssignmentOutlined}
      SecondaryIcon={ChatBubbleOutline}
      title={data.title}
    />
  );
};

export default SurveyOverviewListItem;
