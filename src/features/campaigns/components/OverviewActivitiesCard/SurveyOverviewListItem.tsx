import { FC } from 'react';
import { AssignmentOutlined, ChatBubbleOutline } from '@mui/icons-material';

import OverviewListItem from './OverviewListItem';
import { SurveyActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import useModel from 'core/useModel';

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

  const stats = dataModel.getStats().data;

  const submissionCount = stats?.submissionCount || 0;

  return (
    <OverviewListItem
      activity={activity}
      endNumber={submissionCount.toString()}
      focusDate={focusDate}
      href={`/organize/${survey.organization.id}/projects/${
        survey.campaign?.id ?? 'standalone'
      }/surveys/${survey.id}`}
      PrimaryIcon={AssignmentOutlined}
      SecondaryIcon={ChatBubbleOutline}
      title={survey.title}
    />
  );
};

export default SurveyOverviewListItem;
