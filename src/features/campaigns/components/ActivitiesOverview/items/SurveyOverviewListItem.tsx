import { FC } from 'react';
import { AssignmentOutlined, ChatBubbleOutline } from '@mui/icons-material';

import OverviewListItem from './OverviewListItem';
import { SurveyActivity } from 'features/campaigns/types';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import useModel from 'core/useModel';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

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
      endDate={activity.visibleUntil}
      endNumber={submissionCount}
      focusDate={focusDate}
      href={`/organize/${survey.organization.id}/projects/${
        survey.campaign?.id ?? 'standalone'
      }/surveys/${survey.id}`}
      PrimaryIcon={AssignmentOutlined}
      SecondaryIcon={ChatBubbleOutline}
      startDate={activity.visibleFrom}
      statusBar={
        stats?.submissionCount ? (
          <ZUIStackedStatusBar
            height={4}
            values={[
              {
                color: 'statusColors.orange',
                value: stats.unlinkedSubmissionCount,
              },
              {
                color: 'statusColors.green',
                value: stats.submissionCount - stats.unlinkedSubmissionCount,
              },
            ]}
          />
        ) : null
      }
      title={survey.title}
    />
  );
};

export default SurveyOverviewListItem;
